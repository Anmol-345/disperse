import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { RecipientInfo } from "../types/Recipient";
import { TxStatus } from "../types/Transaction";
import Status from "./Status";

type ConfirmProps = {
  recipientsData: RecipientInfo[];
  total: ethers.BigNumber | null;
  tokenBalance: string | null;
  remaining: string | null;
  approve: () => Promise<void>;
  disperse: () => Promise<void>;
  txStatus: TxStatus | null;
  approveStatus: TxStatus | null;
};

const Confirm = ({
  recipientsData,
  total,
  tokenBalance,
  remaining,
  approve,
  disperse,
  txStatus,
  approveStatus,
}: ConfirmProps) => {
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    if (total && tokenBalance) {
      setIsDisabled(!ethers.utils.parseUnits(tokenBalance).gt(total));
    }
  }, [total, tokenBalance]);

  const Row = ({ label, value, danger }: { label: string; value: string | null; danger?: boolean }) => (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        padding: "10px 0",
        borderBottom: "1px solid var(--gray-light)",
      }}
    >
      <span style={{ fontStyle: "italic", color: "var(--gray-dark)", fontSize: "0.9rem" }}>{label}</span>
      <span
        style={{
          fontFamily: "monospace",
          fontSize: "0.9rem",
          color: danger ? "var(--black)" : "var(--black)",
          fontWeight: danger ? 600 : 400,
        }}
      >
        {value ?? "—"}
      </span>
    </div>
  );

  return (
    <div className="fade-in" style={{ marginTop: "40px" }}>
      <p className="dp-label">confirm</p>

      {/* Recipients table */}
      <div style={{ marginBottom: "8px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "8px 0",
            borderBottom: "2px solid var(--black)",
          }}
        >
          <span style={{ fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>address</span>
          <span style={{ fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>amount</span>
        </div>

        {recipientsData.map((recipient, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 0",
              borderBottom: "1px solid var(--gray-light)",
              gap: "16px",
            }}
          >
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "0.8rem",
                color: "var(--gray-dark)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                flex: 1,
              }}
            >
              {recipient.address}
            </span>
            <span style={{ fontFamily: "monospace", fontSize: "0.85rem", flexShrink: 0 }}>
              {ethers.utils.formatEther(recipient.value)}
            </span>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div style={{ marginTop: "4px" }}>
        <Row label="total" value={total ? ethers.utils.formatEther(total) : null} />
        <Row label="your balance" value={tokenBalance} />
        <Row label="remaining" value={remaining} danger={isDisabled} />
      </div>

      {isDisabled && (
        <p className="dp-error" style={{ marginTop: "16px" }}>
          total exceeds your token balance
        </p>
      )}

      {/* Action buttons */}
      <div style={{ marginTop: "32px" }}>
        <p className="dp-label">allowance</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "flex-start" }}>
          <div>
            <button
              id="approve-btn"
              className="dp-btn-ghost"
              onClick={approve}
              disabled={isDisabled}
            >
              approve
            </button>
            {approveStatus && <Status txnStatus={approveStatus} />}
          </div>
          <div>
            <button
              id="disperse-token-btn"
              className="dp-btn"
              onClick={disperse}
              disabled={isDisabled}
            >
              disperse token
            </button>
            {txStatus && <Status txnStatus={txStatus} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirm;
