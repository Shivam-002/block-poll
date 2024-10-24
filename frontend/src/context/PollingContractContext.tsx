import { contractABI, contractAddress } from "@/utils";
import { createContext, useContext, useEffect, useState } from "react";

import { Web3 } from "web3";

export interface PollingContractContextType {
  pollingContract: any;
}

const PollingContractContext = createContext<PollingContractContextType | null>(
  null
);

export const usePollingContract = () => {
  const context = useContext(PollingContractContext);

  if (!context) {
    throw new Error(
      "usePollingContract must be used within a PollingContractProvider"
    );
  }

  return context;
};

export const PollingContractProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [pollingContract, setPollingContract] = useState<any>(null);

  useEffect(() => {
    const web3 = new Web3(window.ethereum);
    const contractInstance = new web3.eth.Contract(
      contractABI,
      contractAddress
    );
    setPollingContract(contractInstance);
  }, []);

  return (
    <PollingContractContext.Provider
      value={{
        pollingContract: pollingContract,
      }}
    >
      {children}
    </PollingContractContext.Provider>
  );
};
