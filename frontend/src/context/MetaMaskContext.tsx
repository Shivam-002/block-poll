import { EthBalance } from "@/global";
import React, { createContext, useContext, useEffect, useState } from "react";

export interface MetaMaskContextType {
  handleConnectWallet: () => void;
  handleDisconnectWallet: () => void;
  handleConnectOnce: () => void;
  handlePersonalSign: () => void;
  handleGetBalance: () => void;
  handleSendTransaction: (
    sender: string,
    receiver: string,
    amount: number
  ) => Promise<void>;
  isConnected: boolean;
  walletAccount: string;
  currentChain: string;
  ethBalance: EthBalance | null;
}

const MetaMaskContext = createContext<MetaMaskContextType | null>(null);

export const useMetaMask = () => {
  const context = useContext(MetaMaskContext);

  if (!context) {
    throw new Error("useMetaMask must be used within a MetaMaskProvider");
  }
  return context;
};

export const MetaMaskProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [walletAccount, setWalletAccount] = useState<string>("");
  const [currentChain, setCurrentChain] = useState<string>("");
  useState<boolean>(false);

  const [ethBalance, setEthBalance] = useState<EthBalance | null>(null);

  const handleConnectWallet = async () => {
    try {
      console.log("Connecting MetaMask...");
      if (typeof window.ethereum !== "undefined") {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const account = accounts[0];
        console.log("Account: ", account);
        setWalletAccount(account);
      } else {
        console.error(
          "MetaMask is not installed. Please install it to use this feature."
        );
        alert(
          "MetaMask is not installed. Please install it to use this feature."
        );
      }
    } catch (error) {
      console.error("Failed to connect MetaMask:", error);
      alert("Failed to connect MetaMask. Please try again.");
    }
  };
  const handleDisconnect = async () => {
    console.log("Disconnecting MetaMask...");
    setIsConnected(false);
    setWalletAccount("");
  };
  const handleConnectOnce = async () => {
    const accounts = await window.ethereum
      .request({
        method: "wallet_requestPermissions",
        params: [{ eth_accounts: {} }],
      })
      .then(() => window.ethereum.request({ method: "eth_requestAccounts" }));

    setWalletAccount(accounts[0]);
  };
  const handlePersonalSign = async () => {
    console.log("Sign Authentication");
    const message = [
      "This site is requesting your signature to approve login authorization!",
      "I have read and accept the terms and conditions (https://example.org/) of this app.",
      "Please sign me in!",
    ].join("\n\n");

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const account = accounts[0];

    const sign = await window.ethereum.request({
      method: "personal_sign",
      params: [message, account],
    });
  };

  const handleGetBalance = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const account = accounts[0];

    const balance = await window.ethereum.request({
      method: "eth_getBalance",
      params: [account, "latest"],
    });

    // Returns a hex value of Wei
    const wei = parseInt(balance, 16);
    const gwei = wei / Math.pow(10, 9);
    const eth = wei / Math.pow(10, 18);

    console.log("Balance: ", { wei, gwei, eth });

    setEthBalance({ wei, gwei, eth });
  };

  const handleSendTransaction = async (
    sender: string,
    receiver: string,
    amount: number
  ) => {
    const gasPrice = "0x5208"; // 21000 Gas Price
    const amountHex = (amount * Math.pow(10, 18)).toString(16);

    const tx = {
      from: sender,
      to: receiver,
      value: amountHex,
      gas: gasPrice,
    };

    await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [tx],
    });
  };

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        console.log("Account changed: ", accounts[0]);
        setWalletAccount(accounts[0]);
      });

      window.ethereum.on("chainChanged", (chainId: string) => {
        console.log("Chain ID changed: ", chainId);

        // Check if we're connected to Ganache
        if (chainId === "0x539") {
          // "0x539" is the hex representation of 1337
          console.log("Connected to Ganache");
        } else {
          console.log("Not connected to Ganache, current chainId: ", chainId);
        }

        setCurrentChain(chainId);
      });
    } else {
      alert("Please install MetaMask to use this service!");
    }
  }, []);

  useEffect(() => {
    setIsConnected(walletAccount ? true : false);
  }, [walletAccount]);

  useEffect(() => {
    if (isConnected) {
      handleGetBalance();
    }
  }, [isConnected]);

  return (
    <MetaMaskContext.Provider
      value={{
        handleConnectWallet: handleConnectWallet,
        handleDisconnectWallet: handleDisconnect,
        handleConnectOnce: handleConnectOnce,
        handlePersonalSign: handlePersonalSign,
        handleGetBalance: handleGetBalance,
        handleSendTransaction: handleSendTransaction,
        isConnected: isConnected,
        walletAccount: walletAccount,
        currentChain: currentChain,
        ethBalance: ethBalance,
      }}
    >
      {children}
    </MetaMaskContext.Provider>
  );
};
