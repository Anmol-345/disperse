import { useContext } from "react";
import { NetworkContext } from "../App";
import { getNetworkInfo } from "../utils";
import { TxStatus } from "../types/Transaction";

type StatusProps = {
  txnStatus: TxStatus;
};

const Status = ({ txnStatus }: StatusProps) => {
  const { chainId } = useContext(NetworkContext);
  const networkInfo = getNetworkInfo(chainId);

  const isPending = txnStatus.status === "pending";
  const isSuccess = txnStatus.status === "success";

  return (
    <div
      className={isPending ? "animate-pulse" : "fade-in"}
      style={{ marginTop: "12px", paddingLeft: "12px", borderLeft: "2px solid var(--black)" }}
    >
      <p className={isSuccess ? "dp-status-success" : "dp-status-pending"}>
        {isPending ? "⏳ transaction pending..." : "✓ transaction confirmed"}
      </p>
      {txnStatus.hash && (
        <a
          href={`${networkInfo?.blockExplorer}tx/${txnStatus.hash}`}
          target="_blank"
          rel="noreferrer"
          style={{
            fontSize: "0.72rem",
            fontFamily: "monospace",
            color: "var(--gray-dark)",
            borderBottom: "1px solid var(--gray-mid)",
            wordBreak: "break-all",
            display: "block",
            marginTop: "4px",
          }}
        >
          {txnStatus.hash}
        </a>
      )}
    </div>
  );
};

export default Status;
