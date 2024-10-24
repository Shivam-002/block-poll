export const dummyPolls = [
  {
    id: "1",
    title: "Favorite Programming Language",
    description: "What's your go-to programming language?",
    options: [
      { id: "1a", text: "JavaScript", votes: 50 },
      { id: "1b", text: "Python", votes: 30 },
      { id: "1c", text: "Java", votes: 25 },
      { id: "1d", text: "C++", votes: 15 },
    ],
    totalVotes: 120,
    voted: false,
    private: false,
  },
  {
    id: "2",
    title: "Best Frontend Framework",
    description: "Which frontend framework do you prefer?",
    options: [
      { id: "2a", text: "React", votes: 40 },
      { id: "2b", text: "Vue", votes: 25 },
      { id: "2c", text: "Angular", votes: 20 },
    ],
    totalVotes: 85,
    voted: true,
    private: false,
  },
  {
    id: "3",
    title: "Next Company Outing",
    description: "Where should we go for our next company outing?",
    options: [
      { id: "3a", text: "Beach Day", votes: 20 },
      { id: "3b", text: "Escape Room", votes: 15 },
      { id: "3c", text: "Hiking Trip", votes: 10 },
    ],
    totalVotes: 45,
    voted: false,
    private: true,
  },
];
