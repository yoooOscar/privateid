import './globals.css';

export const metadata = {
  title: "PrivID - Privacy-Preserving Identity",
  description: "Secure on-chain identity verification powered by Zama FHEVM",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="app-container">
          {children}
        </div>
      </body>
    </html>
  );
}


