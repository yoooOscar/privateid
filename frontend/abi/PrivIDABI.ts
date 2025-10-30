
/*
  This file is auto-generated.
  Command: 'npm run genabi'
*/
export const PrivIDABI = {
  "abi": [
    {
      "inputs": [
        {
          "internalType": "externalEuint8",
          "name": "allowedRegionHandle",
          "type": "bytes32"
        },
        {
          "internalType": "bytes",
          "name": "proof",
          "type": "bytes"
        }
      ],
      "name": "computeAccessFlagsEnc",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "internalType": "externalEuint8",
          "name": "allowedRegionHandle",
          "type": "bytes32"
        },
        {
          "internalType": "bytes",
          "name": "proof",
          "type": "bytes"
        }
      ],
      "name": "getAccessFlagsEnc",
      "outputs": [
        {
          "internalType": "ebool",
          "name": "accessA",
          "type": "bytes32"
        },
        {
          "internalType": "ebool",
          "name": "accessB",
          "type": "bytes32"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getMyAttributes",
      "outputs": [
        {
          "internalType": "euint8",
          "name": "",
          "type": "bytes32"
        },
        {
          "internalType": "euint8",
          "name": "",
          "type": "bytes32"
        },
        {
          "internalType": "ebool",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getMyLastFlagsEnc",
      "outputs": [
        {
          "internalType": "ebool",
          "name": "accessA",
          "type": "bytes32"
        },
        {
          "internalType": "ebool",
          "name": "accessB",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "hasData",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        }
      ],
      "name": "isAdultEnc",
      "outputs": [
        {
          "internalType": "ebool",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "internalType": "externalEuint8",
          "name": "regionHandle",
          "type": "bytes32"
        },
        {
          "internalType": "bytes",
          "name": "proof",
          "type": "bytes"
        }
      ],
      "name": "isInRegionEnc",
      "outputs": [
        {
          "internalType": "ebool",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        }
      ],
      "name": "isKycPassedEnc",
      "outputs": [
        {
          "internalType": "ebool",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "protocolId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "externalEuint8",
          "name": "ageHandle",
          "type": "bytes32"
        },
        {
          "internalType": "externalEuint8",
          "name": "regionHandle",
          "type": "bytes32"
        },
        {
          "internalType": "externalEbool",
          "name": "kycHandle",
          "type": "bytes32"
        },
        {
          "internalType": "bytes",
          "name": "inputProof",
          "type": "bytes"
        }
      ],
      "name": "submitAttributes",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "externalEuint8",
          "name": "ageHandle",
          "type": "bytes32"
        },
        {
          "internalType": "externalEuint8",
          "name": "regionHandle",
          "type": "bytes32"
        },
        {
          "internalType": "externalEbool",
          "name": "kycHandle",
          "type": "bytes32"
        },
        {
          "internalType": "bytes",
          "name": "inputProof",
          "type": "bytes"
        }
      ],
      "name": "updateAttributes",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]
} as const;

