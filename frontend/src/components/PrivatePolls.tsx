import React from "react";
import { PollCard } from "./PollCard";
import { dummyPolls } from "../data/DummyPolls";

export const PrivatePolls: React.FC = () => (
  <div>
    <h2 className="text-2xl font-bold mb-4">Private Polls</h2>
    {dummyPolls
      .filter((poll) => poll.private)
      .map((poll) => (
        <PollCard
          key={poll.id}
          id={poll.id}
          title={poll.title}
          description={poll.description}
          options={poll.options}
          totalVotes={poll.totalVotes}
          userVote={poll.voted ? poll.options[0].id : null}
          onVote={(pollId, optionId) =>
            console.log(`Voted for option ${optionId} in poll ${pollId}`)
          }
        />
      ))}
  </div>
);
