import { useState } from "react";
import { motion } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Confirm your password";

    if (
      formData.password &&
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const isValid = validateForm();
    if (!isValid) {
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.post(
       `${import.meta.env.VITE_API_BASE_URL}/signup`,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        },
        { withCredentials: true }
      );

      if (res.status === 201) {
        toast.success("Signup successful! Redirecting to login...", {
          autoClose: 4000,
        });

        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
        });

        setTimeout(() => {
          navigate("/login");
        }, 5000);
      }
    } catch (err) {
      toast.error(err.response?.data || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const shakeIfError = (field) =>
    errors[field] ? { x: [-8, 8, -6, 6, 0] } : {};

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex flex-col justify-center items-center p-4">
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
          <p className="text-gray-400">Join the developer matching network</p>
        </div>

        <motion.div
          className="bg-gray-800/80 backdrop-blur-sm md:p-8 p-4 rounded-2xl shadow-xl border border-gray-700 text-white"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-center text-white">
            Create Account
          </h2>

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-4 flex gap-2">
              <div className="w-full">
                <label className="block text-gray-300 mb-2" htmlFor="firstName">
                  First Name
                </label>
                <motion.input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-gray-700/50 border ${
                    errors.firstName ? "border-red-500" : "border-gray-600"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  placeholder="John"
                  animate={shakeIfError("firstName")}
                  transition={{ duration: 0.4 }}
                />
                {errors.firstName && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div className="w-full">
                <label className="block text-gray-300 mb-2" htmlFor="lastName">
                  Last Name
                </label>
                <motion.input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-gray-700/50 border ${
                    errors.lastName ? "border-red-500" : "border-gray-600"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  placeholder="Doe"
                  animate={shakeIfError("lastName")}
                  transition={{ duration: 0.4 }}
                />
                {errors.lastName && (
                  <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-300 mb-2" htmlFor="email">
                Email
              </label>
              <motion.input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-gray-700/50 border ${
                  errors.email ? "border-red-500" : "border-gray-600"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="your@email.com"
                animate={shakeIfError("email")}
                transition={{ duration: 0.4 }}
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-300 mb-2" htmlFor="password">
                Password
              </label>
              <motion.input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-gray-700/50 border ${
                  errors.password ? "border-red-500" : "border-gray-600"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="••••••••"
                animate={shakeIfError("password")}
                transition={{ duration: 0.4 }}
              />
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div className="mb-6">
              <label
                className="block text-gray-300 mb-2"
                htmlFor="confirmPassword"
              >
                Confirm Password
              </label>
              <motion.input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-gray-700/50 border ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-600"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="••••••••"
                animate={shakeIfError("confirmPassword")}
                transition={{ duration: 0.4 }}
              />
              {errors.confirmPassword && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <motion.button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 rounded-lg text-white font-medium shadow-lg hover:shadow-purple-500/20 transition-all cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Sign Up"}
            </motion.button>
          </form>

          <div className="mt-6 text-center text-gray-400">
            Already have an account?{" "}
            <NavLink
              to="/login"
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              Login
            </NavLink>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
export default Signup;
