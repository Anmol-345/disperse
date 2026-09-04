type WalletInfoProps = {
  address: string;
};

const WalletInfo = ({ address }: WalletInfoProps) => {

  return (
    <div className="fade-in" style={{ marginBottom: "40px" }}>
      <p className="dp-label">connected wallet</p>
      <p
        style={{
          fontSize: "0.9rem",
          color: "var(--gray-dark)",
          fontFamily: "monospace",
          letterSpacing: "0.04em",
        }}
        title={address}
      >
        {address}
      </p>
    </div>
  );
};

export default WalletInfo;
