import { useContext } from "react";
import { NetworkContext } from "../App";

type HeaderProps = {
  address: string | null;
};

const Header = ({ address }: HeaderProps) => {
  const networkContext = useContext(NetworkContext);

  return (
    <header style={{ paddingTop: "56px", paddingBottom: "32px" }}>
      {/* Masthead row */}
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "16px" }}>
        <h1
          style={{
            fontSize: "clamp(2.4rem, 6vw, 4rem)",
            fontWeight: 300,
            letterSpacing: "-0.02em",
            fontStyle: "italic",
            margin: 0,
            lineHeight: 1,
          }}
        >
          disperse
        </h1>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {address && (
            <span className="dp-badge">
              {networkContext.network ? networkContext.network : "⚠ unsupported"}
            </span>
          )}
        </div>
      </div>

      {/* Tagline */}
      <p
        style={{
          marginTop: "16px",
          fontSize: "1rem",
          fontWeight: 300,
          color: "var(--gray-dark)",
          letterSpacing: "0.01em",
          lineHeight: 1.6,
          maxWidth: "520px",
        }}
      >
        <em>verb</em> — distribute native BOT tokens to multiple addresses in a single transaction.
      </p>
    </header>
  );
};

export default Header;
