import { ethers } from "ethers";
import { createContext, useEffect, useReducer, useState } from "react";

import "./App.css";
import Header from "./components/Headers";
import Payment from "./components/Payment";
import WalletInfo from "./components/WalletInfo";
import Warn from "./components/Warn";
import Web3Modal from "web3modal";
import Connect from "./components/Connect";
import { initNetworkContextType, initState, reducer } from "./reducers";
import { getNetworkInfo, isChainSupported } from "./utils";

export const NetworkContext = createContext(initNetworkContextType);

function App() {
  const [isMetamaskConnected, setIsMetamaskConnected] = useState(false);
  const [isMetamaskInstalled, setIsMetamaskInstalled] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [state, dispatch] = useReducer(reducer, initState);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
      window.ethereum.on("accountsChanged", () => {
        window.location.reload();
      });
    }
  });

  const fetchNetworkDetails = async () => {
    try {
      const { ethereum } = window;
      const provider = new ethers.providers.Web3Provider(ethereum);
      const { chainId } = await provider.getNetwork();
      const signer = provider.getSigner();
      const address = await signer.getAddress();

      if (!isChainSupported(chainId)) {
        dispatch({ type: "SET_NETWORK", payload: null });
      } else {
        const networkInfo = getNetworkInfo(chainId);
        if (networkInfo) {
          dispatch({ type: "SET_NETWORK", payload: networkInfo.name });
        }
      }

      dispatch({ type: "SET_CHAIN_ID", payload: chainId });
      setAddress(address);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const checkAccountConnected = async () => {
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const accounts = await provider.listAccounts();
    if (!accounts.length) {
      setIsMetamaskConnected(false);
      return;
    }
    setIsMetamaskConnected(true);
  };

  const connect = async () => {
    try {
      const web3modal = new Web3Modal();
      const result = await web3modal.connect();
      if (result) {
        setIsMetamaskConnected(true);
        fetchNetworkDetails();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const { ethereum } = window;
    if (ethereum) {
      setIsMetamaskInstalled(true);
      checkAccountConnected();
      fetchNetworkDetails();
    } else {
      setIsMetamaskInstalled(false);
    }
  }, []);

  return (
    <div style={{ maxWidth: "860px", margin: "0 auto", padding: "0 32px 80px" }}>
      <NetworkContext.Provider
        value={{
          chainId: state.chainId,
          network: state.network,
        }}
      >
        <Header address={address} />

        {/* ===== HERO SECTION ===== */}
        <section style={{ textAlign: "center", padding: "40px 0px 20px" }}>
          <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "2px", color: "var(--gray-dark)", marginBottom: "16px", display: "block" }}>
            On BotChain Mainnet
          </span>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", margin: "0 0 16px 0", color: "var(--black)" }}>
            Disperse tokens effortlessly.
          </h1>
          <p style={{ fontSize: "1.1rem", color: "var(--gray-dark)", maxWidth: "600px", margin: "0 auto 40px auto", lineHeight: "1.5" }}>
            A decentralized tool to distribute BOT and ERC20 tokens to multiple addresses in a single transaction. Save time, save gas, and execute batch transfers securely.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "24px", textAlign: "left", marginBottom: "20px" }}>
            <div style={{ padding: "20px", border: "1px solid #eaeaea", borderRadius: "8px", background: "#f9f9f9" }}>
              <div style={{ fontSize: "1.5rem", marginBottom: "12px" }}>🔌</div>
              <h3 style={{ fontSize: "1.1rem", margin: "0 0 8px 0", color: "var(--black)" }}>Connect</h3>
              <p style={{ fontSize: "0.9rem", color: "var(--gray-dark)", margin: 0 }}>Link your wallet to the BotChain mainnet to begin.</p>
            </div>
            <div style={{ padding: "20px", border: "1px solid #eaeaea", borderRadius: "8px", background: "#f9f9f9" }}>
              <div style={{ fontSize: "1.5rem", marginBottom: "12px" }}>📝</div>
              <h3 style={{ fontSize: "1.1rem", margin: "0 0 8px 0", color: "var(--black)" }}>Input Data</h3>
              <p style={{ fontSize: "0.9rem", color: "var(--gray-dark)", margin: 0 }}>Paste your addresses and amounts in the input field.</p>
            </div>
            <div style={{ padding: "20px", border: "1px solid #eaeaea", borderRadius: "8px", background: "#f9f9f9" }}>
              <div style={{ fontSize: "1.5rem", marginBottom: "12px" }}>🚀</div>
              <h3 style={{ fontSize: "1.1rem", margin: "0 0 8px 0", color: "var(--black)" }}>Disperse</h3>
              <p style={{ fontSize: "0.9rem", color: "var(--gray-dark)", margin: 0 }}>Approve and execute a single transaction to distribute.</p>
            </div>
          </div>
        </section>

        {/* Top rule */}
        <div className="dp-divider" style={{ marginTop: 0 }} />

        {isMetamaskInstalled ? (
          !isMetamaskConnected && <Connect connect={connect} />
        ) : (
          <Warn />
        )}

        {!isLoading && address && (
          <>
            <WalletInfo address={address} />
            <Payment address={address} />
          </>
        )}

        {/* Footer */}
        <footer style={{ marginTop: '2rem', padding: '2rem 1.5rem', borderTop: '1px solid #eaeaea', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <img src="https://botchain.ai/favicon.ico" alt="Botchain Logo" width={18} height={18} style={{ opacity: 0.8 }} />
            <span style={{ color: 'var(--black)', fontWeight: 600, fontSize: '0.8rem', letterSpacing: '0.05em' }}>Ecosystem Partner · Botchain</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <a href="https://botchain.ai" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gray-dark)', textDecoration: 'none', fontSize: '0.8rem', borderBottom: '1px solid #eaeaea', paddingBottom: '1px' }}>BOT Chain Official Website ↗</a>
            <a href="https://scan.botchain.ai" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gray-dark)', textDecoration: 'none', fontSize: '0.8rem', borderBottom: '1px solid #eaeaea', paddingBottom: '1px' }}>BOT Chain Explorer ↗</a>
          </div>
          <p style={{ fontSize: "0.75rem", color: "var(--gray)", fontStyle: "italic", marginTop: "1.5rem" }}>
            disperse — distribute tokens &amp; ether to multiple addresses. use at your own risk.
          </p>
        </footer>
      </NetworkContext.Provider>
    </div>
  );
}

export default App;
