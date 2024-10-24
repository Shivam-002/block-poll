import React from "react";
import { PollCard } from "./PollCard";
import { dummyPolls } from "../data/DummyPolls";

export const MyVotedPolls: React.FC = () => (
  <div>
    <h2 className="text-2xl font-bold mb-4">My Voted Polls</h2>
    {dummyPolls
      .filter((poll) => poll.voted)
      .map((poll) => (
        <PollCard
          key={poll.id}
          id={poll.id}
          title={poll.title}
          description={poll.description}
          options={poll.options}
          totalVotes={poll.totalVotes}
          userVote={poll.options[0].id}
          onVote={(pollId, optionId) =>
            console.log(`Voted for option ${optionId} in poll ${pollId}`)
          }
        />
      ))}
  </div>
);
