import { useState, useEffect, useContext } from "react";
import { ethers } from "ethers";

import Disperse from "../artifacts/Disperse.json";
import { getNetworkInfo, parseText } from "../utils/index";
import Recipients from "./Recipients";
import ConfirmEther from "./ConfirmEther";
import { NetworkContext } from "../App";
import { TxStatus } from "../types/Transaction";
import { RecipientInfo } from "../types/Recipient";

type EtherProps = {
  address: string;
};

const Ether = ({ address }: EtherProps) => {
  const [ethBalance, setEthBalance] = useState<string | null>(null);
  const [textValue, setTextValue] = useState("");
  const [total, setTotal] = useState<ethers.BigNumber | null>(null);
  const [recipientsData, setRecipientsData] = useState<RecipientInfo[]>([]);
  const [remaining, setRemaining] = useState<string | null>(null);
  const { chainId } = useContext(NetworkContext);
  const [txStatus, setTxStatus] = useState<TxStatus | null>(null);
  const networkInfo = getNetworkInfo(chainId);
  const disperseAddress = networkInfo?.disperseAddress;

  const getEthBalance = async () => {
    const { ethereum } = window;
    if (!ethBalance) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const balance = await provider.getBalance(address);
      setEthBalance(ethers.utils.formatEther(balance));
    }
  };

  useEffect(() => {
    getEthBalance();
  }, []);

  useEffect(() => {
    setRecipientsData(parseText(textValue));
  }, [textValue]);

  useEffect(() => {
    if (recipientsData.length > 0) {
      let newTotal = recipientsData[0].value;
      for (let i = 1; i < recipientsData.length; i++) {
        newTotal = newTotal.add(recipientsData[i].value);
      }
      setTotal(newTotal);
    } else {
      setTotal(null);
    }
  }, [recipientsData]);

  const disperseEther = async () => {
    try {
      setTxStatus(null);
      const { ethereum } = window;
      if (ethereum && disperseAddress) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const disperseContract = new ethers.Contract(
          disperseAddress,
          Disperse.abi,
          signer
        );
        const recipients = recipientsData.map((r) => r.address);
        const values = recipientsData.map((r) => r.value);
        const txn = await disperseContract.disperseEther(recipients, values, {
          value: total,
        });
        setTxStatus({ hash: txn.hash, status: "pending" });
        await txn.wait();
        setTxStatus({ hash: txn.hash, status: "success" });
      }
    } catch (error) {
      console.log("error dispersing BOT:", error);
    }
  };

  useEffect(() => {
    if (ethBalance && total) {
      const tokenBalance = ethers.utils.parseEther(ethBalance);
      setRemaining(ethers.utils.formatEther(tokenBalance.sub(total)));
    } else {
      setRemaining(null);
    }
  }, [total]);

  return (
    <div className="fade-in">
      {/* ETH balance */}
      <div style={{ marginBottom: "8px" }}>
        <p className="dp-label">your balance</p>
        <p style={{ fontFamily: "monospace", fontSize: "1rem" }}>
          {ethBalance ?? "..."}{" "}
          <span style={{ fontSize: "0.75rem", color: "var(--gray-dark)" }}>BOT</span>
        </p>
      </div>

      <Recipients
        textValue={textValue}
        setTextValue={setTextValue}
        tokenSymbol={"BOT"}
      />

      {recipientsData.length > 0 && (
        <ConfirmEther
          recipientsData={recipientsData}
          total={total}
          disperse={disperseEther}
          tokenBalance={ethBalance}
          remaining={remaining}
          txStatus={txStatus}
        />
      )}
    </div>
  );
};

export default Ether;
