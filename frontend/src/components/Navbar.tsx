import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Vote, Lock, Settings, PlusCircle, BarChart2 } from "lucide-react";

const navItems = [
  { icon: Vote, label: "All Polls", path: "/" },
  // { icon: Settings, label: "My Voted Polls", path: "/voted" },
  // { icon: Lock, label: "Private Polls", path: "/private" },
  { icon: PlusCircle, label: "Create Poll", path: "/create" },
  { icon: BarChart2, label: "Manage Polls", path: "/manage" },
];

export const Navbar: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="flex flex-col space-y-2 p-4 bg-secondary w-64 h-[calc(100vh-5rem)]">
      {navItems.map((item) => (
        <Button
          key={item.path}
          variant="ghost"
          className={cn(
            "justify-start",
            location.pathname === item.path && "bg-secondary-foreground/10"
          )}
          asChild
        >
          <Link to={item.path}>
            <item.icon className="mr-2 h-4 w-4" />
            {item.label}
          </Link>
        </Button>
      ))}
    </nav>
  );
};
