// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint8, euint32, ebool, eaddress, externalEuint8, externalEuint32, externalEbool} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title PrivID — FHE-encrypted on-chain identity attributes and checks
/// @notice Stores encrypted identity attributes per user and evaluates permissions fully homomorphically
contract PrivID is SepoliaConfig {
    struct Attributes {
        euint8 age;        // encrypted age (0-255)
        euint8 region;     // encrypted region code (e.g., 1:AS, 2:EU, ...)
        ebool kycPassed;   // encrypted KYC boolean
    }

    struct Flags {
        ebool accessA; // isAdult && kycPassed
        ebool accessB; // isInRegion
    }

    mapping(address => Attributes) private _userAttrs;
    mapping(address => bool) public hasData;
    mapping(address => Flags) private _lastFlags;

    /// @notice Submit encrypted attributes. Values come from Relayer handles.
    /// @dev Uses FHE.fromExternal to import ciphertexts and sets ACL for caller and contract.
    function submitAttributes(
        externalEuint8 ageHandle,
        externalEuint8 regionHandle,
        externalEbool kycHandle,
        bytes calldata inputProof
    ) public {
        euint8 _age = FHE.fromExternal(ageHandle, inputProof);
        euint8 _region = FHE.fromExternal(regionHandle, inputProof);
        ebool _kyc = FHE.fromExternal(kycHandle, inputProof);

        _userAttrs[msg.sender] = Attributes({age: _age, region: _region, kycPassed: _kyc});
        hasData[msg.sender] = true;

        // Allow both this contract and the user to decrypt their own fields later.
        FHE.allowThis(_userAttrs[msg.sender].age);
        FHE.allowThis(_userAttrs[msg.sender].region);
        FHE.allowThis(_userAttrs[msg.sender].kycPassed);
        FHE.allow(_userAttrs[msg.sender].age, msg.sender);
        FHE.allow(_userAttrs[msg.sender].region, msg.sender);
        FHE.allow(_userAttrs[msg.sender].kycPassed, msg.sender);
    }

    /// @notice Update encrypted attributes. Same as submit but overwrites.
    function updateAttributes(
        externalEuint8 ageHandle,
        externalEuint8 regionHandle,
        externalEbool kycHandle,
        bytes calldata inputProof
    ) external {
        submitAttributes(ageHandle, regionHandle, kycHandle, inputProof);
    }

    /// @notice Returns encrypted handles for user's attributes so frontends can decrypt client-side
    function getMyAttributes() external view returns (euint8, euint8, ebool) {
        Attributes storage a = _userAttrs[msg.sender];
        return (a.age, a.region, a.kycPassed);
    }

    /// @notice Public view: get encrypted boolean for "is adult (>=18)"
    function isAdultEnc(address user) external returns (ebool) {
        Attributes storage a = _userAttrs[user];
        euint8 eighteen = FHE.asEuint8(18);
        // a.age >= 18
        return FHE.ge(a.age, eighteen);
    }

    /// @notice Public view: get encrypted boolean for region equality
    function isInRegionEnc(address user, externalEuint8 regionHandle, bytes calldata proof) external returns (ebool) {
        euint8 region = FHE.fromExternal(regionHandle, proof);
        Attributes storage a = _userAttrs[user];
        return FHE.eq(a.region, region);
    }

    /// @notice Public view: get encrypted boolean for KYC status
    function isKycPassedEnc(address user) external view returns (ebool) {
        return _userAttrs[user].kycPassed;
    }

    /// @notice Compute encrypted access flags according to requirement:
    /// - Access_A: isAdult && kycPassed
    /// - Access_B: isInRegion(ALLOWED_REGION)
    function getAccessFlagsEnc(address user, externalEuint8 allowedRegionHandle, bytes calldata proof)
        public
        returns (ebool accessA, ebool accessB)
    {
        Attributes storage a = _userAttrs[user];
        ebool isAdult = FHE.ge(a.age, FHE.asEuint8(18));
        ebool isVerified = a.kycPassed;
        euint8 allowedRegion = FHE.fromExternal(allowedRegionHandle, proof);
        ebool isInRegion = FHE.eq(a.region, allowedRegion);

        accessA = FHE.and(isAdult, isVerified);
        accessB = isInRegion;

        // Grant decrypt rights of the computed flags to the requesting user
        FHE.allow(accessA, user);
        FHE.allow(accessB, user);
    }

    /// @notice State-changing: compute and persist encrypted flags for msg.sender, and grant decrypt rights to msg.sender
    function computeAccessFlagsEnc(externalEuint8 allowedRegionHandle, bytes calldata proof) external {
        Attributes storage a = _userAttrs[msg.sender];
        require(hasData[msg.sender], "NO_DATA");

        ebool isAdult = FHE.ge(a.age, FHE.asEuint8(18));
        ebool isVerified = a.kycPassed;
        euint8 allowedRegion = FHE.fromExternal(allowedRegionHandle, proof);
        ebool isInRegion = FHE.eq(a.region, allowedRegion);

        _lastFlags[msg.sender].accessA = FHE.and(isAdult, isVerified);
        _lastFlags[msg.sender].accessB = isInRegion;

        // allow contract and user for stored flags
        FHE.allowThis(_lastFlags[msg.sender].accessA);
        FHE.allowThis(_lastFlags[msg.sender].accessB);
        FHE.allow(_lastFlags[msg.sender].accessA, msg.sender);
        FHE.allow(_lastFlags[msg.sender].accessB, msg.sender);
    }

    /// @notice Read last computed encrypted flags for msg.sender
    function getMyLastFlagsEnc() external view returns (ebool accessA, ebool accessB) {
        Flags storage f = _lastFlags[msg.sender];
        return (f.accessA, f.accessB);
    }

    // Note: On-chain decryption is not available. Frontends should decrypt client-side
    // using the re-encryption flow with FHEVM. Use `getAccessFlagsEnc` instead.
}


