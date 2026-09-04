type ConnectProps = {
  connect: () => void;
};

const Connect = ({ connect }: ConnectProps) => {
  return (
    <div className="fade-in" style={{ padding: "48px 0" }}>
      <p className="dp-label">wallet</p>
      <h2
        style={{
          fontSize: "1.6rem",
          fontWeight: 300,
          fontStyle: "italic",
          marginBottom: "8px",
        }}
      >
        connect to get started
      </h2>
      <p style={{ color: "var(--gray-dark)", fontSize: "0.9rem", marginBottom: "28px" }}>
        Please unlock your MetaMask or compatible wallet.
      </p>
      <button id="connect-wallet-btn" className="dp-btn" onClick={connect}>
        connect wallet
      </button>
    </div>
  );
};

export default Connect;
