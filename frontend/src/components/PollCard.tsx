import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";

interface PollInfo {
  id: number;
  question: string;
  description: string;
  createdAt: number;
  closeAt: number;
  isOpen: boolean;
  owner: string;
  options: string[];
  votes: number[];
  userVote: number | null;
}

interface PollCardProps {
  pollInfo: PollInfo;
  onVote: (pollId: number, optionIndex: number) => void;
}

function formatRemainingTime(closeAt: number): string {
  const now = Date.now();
  const remainingTime = Number(closeAt) * 1000 - now;

  if (remainingTime <= 0) {
    return "Closed";
  }

  const seconds = Math.floor(remainingTime / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (days < 1) {
    return `${hours.toString().padStart(2, "0")}:${(minutes % 60)
      .toString()
      .padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")} left`;
  } else if (months < 1) {
    return `${days} day${days > 1 ? "s" : ""} left`;
  } else if (years < 1) {
    return `${months} month${months > 1 ? "s" : ""} ${days % 30} day${
      days % 30 !== 1 ? "s" : ""
    } left`;
  } else {
    return `${years} year${years > 1 ? "s" : ""} ${months % 12} month${
      months % 12 !== 1 ? "s" : ""
    } ${days % 30} day${days % 30 !== 1 ? "s" : ""} left`;
  }
}

export default function Component({ pollInfo, onVote }: PollCardProps) {
  const userVote = Number(pollInfo.userVote);

  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(
    userVote !== 0 ? userVote - 1 : null
  );
  const [remainingTime, setRemainingTime] = useState("");

  useEffect(() => {
    const updateRemainingTime = () => {
      setRemainingTime(formatRemainingTime(pollInfo.closeAt));
    };

    updateRemainingTime();
    const timer = setInterval(updateRemainingTime, 1000);

    return () => clearInterval(timer);
  }, [pollInfo.closeAt]);

  const handleVote = () => {
    if (selectedOption !== null) {
      onVote(pollInfo.id, selectedOption);
      pollInfo.userVote = selectedOption + 1;
    }
  };

  const totalVotes = pollInfo.votes.reduce(
    (sum, votes) => Number(sum) + Number(votes),
    0
  );

  const sortedOptions = pollInfo.options
    .map((text, index) => ({
      index,
      text,
      votes: Number(pollInfo.votes[index]) || 0,
    }))
    .sort((a, b) => Number(b.votes) - Number(a.votes));

  const isVotingClosed = Date.now() / 1000 > pollInfo.closeAt;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full max-w-md mb-4">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            {pollInfo.question}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CardTitle>
          <CardDescription>{pollInfo.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <motion.div
            initial={false}
            animate={{ height: isExpanded ? "auto" : 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <RadioGroup
              value={selectedOption?.toString() || ""}
              onValueChange={(value) => setSelectedOption(parseInt(value))}
              className="space-y-2"
            >
              {sortedOptions.map((option) => (
                <div key={option.index} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={option.index.toString()}
                    id={`option-${option.index}`}
                    disabled={
                      !pollInfo.isOpen || isVotingClosed || userVote !== 0
                    }
                  />
                  <Label
                    htmlFor={`option-${option.index}`}
                    className="flex-grow"
                  >
                    {option.text}
                  </Label>
                  <span className="text-sm text-muted-foreground">
                    {option.votes} votes
                  </span>
                  {isExpanded && (
                    <div className="w-1/2">
                      <Progress
                        value={(option.votes / totalVotes) * 100 || 0}
                        className="h-2"
                      />
                    </div>
                  )}
                </div>
              ))}
            </RadioGroup>
          </motion.div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            onClick={handleVote}
            disabled={
              !pollInfo.isOpen ||
              isVotingClosed ||
              selectedOption === null ||
              userVote !== 0
            }
          >
            {userVote !== 0 ? "Voted" : isVotingClosed ? "Closed" : "Vote"}
          </Button>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              {isVotingClosed
                ? "Closed"
                : userVote !== 0
                ? "Voted"
                : `Time: ${remainingTime}`}
            </span>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
