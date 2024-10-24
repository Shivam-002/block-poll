import React from "react";
import { motion } from "framer-motion";
import { Navbar } from "./Navbar";

interface SidebarProps {
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  return (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: 0 }}
      exit={{ x: "-100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed inset-y-0 left-0 w-64 bg-background shadow-lg z-50 h-full"
    >
      <div className="p-4 h-full">
        <button onClick={onClose} className="mb-4 text-primary-foreground">
          Close
        </button>
        <Navbar />
      </div>
    </motion.div>
  );
};
