import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import CreatePoll from "./components/CreatePoll";
import { Header } from "./components/Header";
import Home from "./components/Home";
import { ManagePolls } from "./components/ManagePolls";
import { Navbar } from "./components/Navbar";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground ">
        <Header />
        <div className="flex">
          <Navbar />
          <main className="flex-1 container mx-auto p-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/create" element={<CreatePoll />} />
              <Route path="/manage" element={<ManagePolls />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}
