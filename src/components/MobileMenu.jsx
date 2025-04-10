import React from "react";
import { motion } from "framer-motion";
import { LogOut, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import { navItems } from "../utils/constant";

const MobileMenu = ({ onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="md:hidden mt-4 overflow-hidden"
    >
      <div className="flex flex-col gap-2 pt-2 border-t border-gray-800">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) =>
              `
      flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-200
      ${isActive ? "bg-purple-500/20 text-purple-300" : "text-gray-300"}
    `
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
        <NavLink
          to="profile"
          onClick={() => setIsMobileMenuOpen(false)}
          className={({ isActive }) =>
            `
      flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-200
      ${isActive ? "bg-purple-500/20 text-purple-300" : "text-gray-300"}
    `
          }
        >
          <User className="w-5 h-5" />
          <span>Profile</span>
        </NavLink>

        <button
          onClick={onClick}
          className="flex items-center gap-2 px-4 py-3 rounded-lg text-left text-red-400 hover:bg-gray-800/70"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </motion.div>
  );
};

export default MobileMenu;
