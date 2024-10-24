import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Wallet } from "lucide-react";
import { useMetaMask } from "../context/MetaMaskContext";
import { EthBalance } from "../global";

export const Header: React.FC = () => {
  const {
    handleConnectWallet,
    handleDisconnectWallet,
    isConnected,
    ethBalance,
  } = useMetaMask();
  const [selectedCurrency, setSelectedCurrency] =
    useState<keyof EthBalance>("eth");

  const formatBalance = (
    balance: number | undefined,
    currency: keyof EthBalance
  ) => {
    if (balance === undefined) return "N/A";
    switch (currency) {
      case "wei":
        return `${balance.toLocaleString()} WEI`;
      case "gwei":
        return `${balance.toLocaleString()} GWEI`;
      case "eth":
        return `${balance.toFixed(4)} ETH`;
      default:
        return "N/A";
    }
  };

  return (
    <header className="bg-primary text-primary-foreground p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Polling Platform</h1>
        <div className="flex items-center space-x-4">
          {isConnected && (
            <>
              <div className="text-sm">
                {formatBalance(
                  ethBalance?.[selectedCurrency],
                  selectedCurrency
                )}
              </div>
              <Select
                value={selectedCurrency}
                onValueChange={(value) =>
                  setSelectedCurrency(value as keyof EthBalance)
                }
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wei">WEI</SelectItem>
                  <SelectItem value="gwei">GWEI</SelectItem>
                  <SelectItem value="eth">ETH</SelectItem>
                </SelectContent>
              </Select>
            </>
          )}
          <Button
            variant="secondary"
            onClick={isConnected ? handleDisconnectWallet : handleConnectWallet}
            className="flex items-center space-x-2"
          >
            <Wallet className="h-4 w-4" />
            <span>{isConnected ? "Disconnect" : "Connect"}</span>
          </Button>
        </div>
      </nav>
    </header>
  );
};
