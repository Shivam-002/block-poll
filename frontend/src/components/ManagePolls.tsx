import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMetaMask } from "@/context/MetaMaskContext";
import { usePollingContract } from "@/context/PollingContractContext";
import { Poll } from "@/global";
import React, { useEffect, useState } from "react";

export const ManagePolls: React.FC = () => {
  const { pollingContract } = usePollingContract();
  const { isConnected, walletAccount } = useMetaMask();
  const [polls, setPolls] = useState<Poll[]>([]);

  const getPolls = async () => {
    if (isConnected) {
      try {
        const polls: any[] = await pollingContract.methods.getUserPolls().call({
          from: walletAccount,
        });
        setPolls(polls);
        console.log("User polls:", polls);
      } catch (error) {
        console.error("Failed to get user polls:", error);
      }
    }
  };

  const deletePoll = async (pollId: number) => {
    if (isConnected) {
      try {
        await pollingContract.methods.deletePoll(pollId).send({
          from: walletAccount,
        });
        console.log(`Deleted poll ${pollId}`);
      } catch (error) {
        console.error(`Failed to delete poll ${pollId}:`, error);
      }

      getPolls();
    }
  };

  useEffect(() => {
    getPolls();
  }, [isConnected]);

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Mange Your Polls</h2>
      {!isConnected ? (
        <p className="text-center text-gray-500">Please connect your wallet.</p>
      ) : polls?.length !== 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {polls?.map((poll) => (
            <Card key={poll.id} className="mb-4">
              <CardHeader>
                <CardTitle>{poll.question}</CardTitle>
                <CardDescription>{poll.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Total Votes: {poll.votes}</p>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => {
                    deletePoll(poll.id);
                  }}
                  variant="destructive"
                >
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          You do not have any polls. Create one now!
        </p>
      )}
    </div>
  );
};
