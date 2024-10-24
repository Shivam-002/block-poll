import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMetaMask } from "@/context/MetaMaskContext";
import { usePollingContract } from "@/context/PollingContractContext";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Minus, Plus } from "lucide-react";
import { FormEvent, useState } from "react";

export default function CreatePoll() {
  const MAX_OPTIONS = 5;

  const [pollTitle, setPollTitle] = useState("Favorite Language");
  const [pollDescription, setPollDescription] = useState("Enter you favorite programming language");
  const [options, setOptions] = useState(["C", "C++"]);
  const [duration, setDuration] = useState("3600");

  const { pollingContract } = usePollingContract();
  const { walletAccount, isConnected } = useMetaMask();

  const addOption = () => {
    if (options.length < MAX_OPTIONS) {
      setOptions([...options, ""]);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
    if (
      index === options.length - 1 &&
      value !== "" &&
      options.length < MAX_OPTIONS
    ) {
      addOption();
    }
  };

  const createPoll = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedOptions = options.filter((option) => option.trim() !== "");

    try {
      let tx;
      tx = await pollingContract.methods
        .createPoll(pollTitle, pollDescription, trimmedOptions, duration)
        .send({ from: walletAccount });
      console.log("Public poll created successfully!", tx);
    } catch (error) {
      console.error(`Failed to create poll:`, error);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create New Poll</CardTitle>
        <CardDescription>Enter the details for your new poll</CardDescription>
      </CardHeader>
      <form onSubmit={createPoll}>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="pollTitle">Poll Title</Label>
              <Input
                id="pollTitle"
                value={pollTitle}
                onChange={(e) => setPollTitle(e.target.value)}
                placeholder="Enter poll title"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="pollDescription">Poll Description</Label>
              <Textarea
                id="pollDescription"
                value={pollDescription}
                onChange={(e: any) => setPollDescription(e.target.value)}
                placeholder="Enter poll description"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Options</Label>
              <AnimatePresence>
                {options.map((option, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center space-x-2"
                  >
                    <Input
                      value={option}
                      onChange={(e) =>
                        handleOptionChange(index, e.target.value)
                      }
                      placeholder={`Option ${index + 1}`}
                      required={index < 2}
                    />
                    {index >= 2 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeOption(index)}
                      >
                        <Minus className="h-4 w-4" />
                        <span className="sr-only">Remove option</span>
                      </Button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              {options.length < MAX_OPTIONS && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={addOption}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Option
                </Button>
              )}
            </div>
            {options.length === MAX_OPTIONS && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Maximum number of options ({MAX_OPTIONS}) reached.
                </AlertDescription>
              </Alert>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="duration">Duration (seconds)</Label>
              <Input
                id="duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Enter poll duration in seconds"
                required
                min="1"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={!isConnected}>
            Create Poll
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
