export interface EthBalance {
  wei: number;
  gwei: number;
  eth: number;
}

export interface CreatePollType {}



export interface Option {
  id: number;
  text: string;
  votes: number;
}

export interface Poll {
  id: number;
  question: string;
  description: string;
  createdAt: number;
  closeAt: number;
  isOpen: boolean;
  owner: string;
  options: Option[];
  votes: number[];
}
declare global {
  interface Window {
    ethereum: any;
  }
}