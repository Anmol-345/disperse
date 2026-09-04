const Warn = () => {
  return (
    <div className="fade-in" style={{ padding: "48px 0" }}>
      <p className="dp-label">notice</p>
      <h2
        style={{
          fontSize: "1.6rem",
          fontWeight: 300,
          fontStyle: "italic",
          marginBottom: "8px",
        }}
      >
        ethereum wallet required
      </h2>
      <p style={{ color: "var(--gray-dark)", fontSize: "0.9rem", lineHeight: 1.7 }}>
        No Ethereum-compatible browser detected. Consider installing{" "}
        <a
          href="https://metamask.io"
          target="_blank"
          rel="noreferrer"
          style={{ borderBottom: "1px solid var(--black)", color: "var(--black)" }}
        >
          MetaMask
        </a>{" "}
        to proceed.
      </p>
    </div>
  );
};

export default Warn;
