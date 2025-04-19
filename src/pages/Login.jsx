import { useState } from "react";
import { motion } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../features/userSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // New state for password visibility

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({ email: "", password: "" });
console.log(showPassword)
  const shakeIfError = (field) =>
    errors[field] ? { x: [-8, 8, -6, 6, 0] } : {};

  const validateForm = () => {
    let isValid = true;
    const newError = { email: "", password: "" };

    if (!email) {
      newError.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newError.email = "Email is invalid";
      isValid = false;
    }

    if (!password) {
      newError.password = "Password is required";
      isValid = false;
    }

    setErrors(newError);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/login`,
        { email, password },
        { withCredentials: true }
      );

      if (res.status === 200) {
        await dispatch(addUser(res.data));
        toast.success("Login successful!", { autoClose: 3000 });
        navigate("/app");
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-800/80 md:bg-gradient-to-b from-gray-900 to-black flex flex-col justify-center items-center p-4">
      <ToastContainer position="top-right" />
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.h1
            className="text-4xl font-bold mb-2"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 10,
              delay: 0.2,
            }}
          >
            <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
              DevTinder
            </span>
          </motion.h1>
          <p className="text-gray-400">Welcome back, dev!</p>
        </div>

        <motion.div
          className="md:bg-gray-800/80 md:backdrop-blur-sm md:p-8 p-4 md:rounded-2xl md:shadow-xl md:border border-gray-700 text-white"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-4">
              <label className="block text-gray-300 mb-2" htmlFor="email">
                Email
              </label>
              <motion.input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3 bg-gray-700/50 border ${
                  errors.email ? "border-red-500" : "border-gray-600"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="you@example.com"
                autoComplete="true"
                animate={shakeIfError("email")}
                transition={{ duration: 0.4 }}
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-gray-300 mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative">

              <motion.input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 bg-gray-700/50 border ${
                  errors.password ? "border-red-500" : "border-gray-600"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="••••••••"
                autoComplete="off" 

                animate={shakeIfError("password")}
                transition={{ duration: 0.4 }}
              />
              <button
                  type="button"
                  onClick={()=>{setShowPassword(!showPassword)}}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <motion.button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 rounded-lg text-white font-medium shadow-lg hover:shadow-purple-500/20 transition-all cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </motion.button>
          </form>

          <div className="mt-6 text-center text-gray-400">
            Don’t have an account?{" "}
            <NavLink
              to="/signup"
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              Sign Up
            </NavLink>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
