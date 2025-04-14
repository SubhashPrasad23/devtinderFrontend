import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { LogOut, User, Code, Menu, X } from "lucide-react";
import axios from "axios";
import { capitalized } from "../utils/Helper";
import MobileMenu from "./MobileMenu";
import { navItems } from "../utils/constant";

const Header = () => {
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);
  const menuRef = useRef(null);

  const handleLogout = () => {
    axios.post("http://localhost:7000/logout", {}, { withCredentials: true });
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowLogoutMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-gray-900/80 backdrop-blur-md  border-b border-purple-500/30 py-4 md:px-10 px-5 sticky top-0 z-50 shadow-lg shadow-purple-500/5">
      <div className="container w-full mx-auto flex items-center justify-between">
        <NavLink to="/app" className=" flex items-center ">
          <motion.div
            initial={{ rotate: -10, scale: 0.9 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 10 }}
            className="mr-2 flex items-center justify-center"
          >
            <Code className="w-7 h-7 text-purple-400" />
          </motion.div>
          <motion.h1
            className="text-2xl font-bold"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 20 }}
          >
            <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
              DevTinder
            </span>
          </motion.h1>
        </NavLink>

        <div className="md:hidden">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-full bg-gray-800/50 text-white"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </motion.button>
        </div>

        <div className="hidden md:flex items-center gap-1 text-white">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:text-purple-300
                ${
                  isActive ? " text-purple-300 font-semibold" : " text-gray-300"
                }
              `}
            >
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                {item.icon}
              </motion.div>
              <span>{item.label}</span>
            </NavLink>
          ))}

          <div className="relative ml-2" ref={menuRef}>
            <motion.button
              className={`
                flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200
                ${
                  showLogoutMenu
                    ? "bg-gray-800/90 text-white"
                    : "hover:bg-gray-800/70 text-gray-300"
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowLogoutMenu((prev) => !prev)}
            >
              <div className="h-10 w-10 rounded-full  bg-purple-500/20 border border-purple-500/30 place-content-center">
              {user?.photoURL !== ""?<img src={user?.photoURL} className="h-full w-full object-cover rounded-full " alt="profileImg"/>:  <p>
                  {user?.firstName ? capitalized(user.firstName.charAt(0)) : ""}
                </p>}
              </div>
            </motion.button>
            <AnimatePresence>
              {showLogoutMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-48 bg-gray-800/90 backdrop-blur-md rounded-lg shadow-lg py-1 z-20 border border-gray-700"
                >
                  <NavLink
                    to="profile"
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-700/50 text-gray-200"
                    onClick={() => setShowLogoutMenu(false)}
                  >
                    <User className="w-4 h-4" />
                    <span>View Profile</span>
                  </NavLink>
                  <div className="border-t border-gray-700 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-700/50 text-red-400"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isMobileMenuOpen && <MobileMenu onClick={handleLogout} />}
      </AnimatePresence>
    </header>
  );
};

export default Header;
