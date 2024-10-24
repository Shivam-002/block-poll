"use client";

import { useMetaMask } from "@/context/MetaMaskContext";
import { usePollingContract } from "@/context/PollingContractContext";
import { Poll } from "@/global";
import { useEffect, useState } from "react";
import PollCard from "./PollCard";

export default function Home() {
  const { pollingContract } = usePollingContract();
  const { isConnected, walletAccount } = useMetaMask();
  const [polls, setPolls] = useState<Poll[]>([]);

  const getPolls = async () => {
    if (isConnected) {
      try {
        const polls: Poll[] = await pollingContract.methods.getPolls().call();
        console.log("Public polls:", polls);
        setPolls(polls);
      } catch (error) {
        console.error("Failed to get public polls:", error);
      }
    }
  };

  const votePoll = async (pollId: number, optionId: number) => {
    if (isConnected) {
      try {
        await pollingContract.methods.vote(pollId, optionId).send({
          from: walletAccount,
        });
        console.log(`Voted for option ${optionId} in poll ${pollId}`);
      } catch (error) {
        console.error(
          `Failed to vote for option ${optionId} in poll ${pollId}:`,
          error
        );
      }

      getPolls();
    }
  };

  useEffect(() => {
    getPolls();
  }, [isConnected]);

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Polls</h2>
      {!isConnected ? (
        <p className="text-center text-gray-500">Please connect your wallet.</p>
      ) : polls?.length !== 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {polls.map((poll: any) => (
            <PollCard key={poll.id} pollInfo={poll} onVote={votePoll} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No polls available..</p>
      )}
    </div>
  );
}
