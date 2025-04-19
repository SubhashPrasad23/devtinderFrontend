import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Edit, Save, Upload, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { capitalized } from "../utils/Helper";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addUser } from "../features/userSlice";
import noImage from "../assets/image/noImage.png";

const Profile = () => {
  const user = useSelector((store) => store?.user);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    skills: "",
    yearsOfExperience: "",
    gender: "",
    age: "",
    profileImg: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        bio: user.bio || "",
        skills: user.skills?.join(", ") || "",
        yearsOfExperience: user.yearsOfExperience || "0",
        gender: user.gender || "",
        age: user.age || "",
        profileImg: user.photoURL || "",
      }));
    }
  }, [user]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.skills.trim()) newErrors.skills = "Skills are required";
    if (!formData.yearsOfExperience)
      newErrors.yearsOfExperience = "Experience is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.age) newErrors.age = "Age is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        profileImg: file,
      }));
    }
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
      const form = new FormData();
      form.append("firstName", formData.firstName);
      form.append("lastName", formData.lastName);
      form.append("age", formData.age);
      form.append("gender", formData.gender);
      form.append("skills", formData.skills);
      form.append("yearOfExperience", formData.yearsOfExperience);
      form.append("bio", formData.bio);
      if (formData.profileImg && typeof formData.profileImg !== "string") {
        form.append("photoURL", formData.profileImg);
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/profile/edit`,
        form,
        { withCredentials: true }
      );

      if (response.status === 200) {
        dispatch(addUser(response.data.data));
        toast.success("Profile updated successfully!");
        setIsEditing(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    setErrors({});
  };
  const shakeIfError = (field) =>
    errors[field] ? { x: [-8, 8, -6, 6, 0] } : {};

  return (
    <div className="flex-1 flex flex-col items-center justify-center pb-5 px-5">
      <motion.div
        className="h-full w-full max-w-2xl mx-auto text-white md:rounded-2xl md:shadow-xl md:border border-gray-700 p-6 backdrop-blur-sm md:bg-gray-800/80 mb-4"
        initial={{ y: 0, opacity: 0 }}
        animate={{ y: 20, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="flex items-center justify-end">
          <button
            onClick={toggleEditMode}
            className="bg-purple-600 hover:bg-purple-700 p-2 rounded-full cursor-pointer"
          >
            {!isEditing ? (
              <Edit className="w-6 h-6" />
            ) : (
              <X className="w-6 h-6" />
            )}
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8 mb-6">
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-purple-500/30">
              {formData.profileImg ? (
                <img
                  src={
                    typeof formData.profileImg === "string"
                      ? formData.profileImg
                      : URL.createObjectURL(formData.profileImg)
                  }
                  className="h-full w-full  object-cover object-top"
                  alt="Profile"
                />
              ) : (
                <img
                  src={noImage}
                  className="h-full w-full object-cover"
                  alt="Profile"
                />
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="profileImg"
              disabled={!isEditing}
            />
            {isEditing && (
              <motion.label
                htmlFor="profileImg"
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Upload className="w-4 h-4" /> Change Photo
              </motion.label>
            )}
          </div>

          <div className="flex-1">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    className="block text-gray-300 mb-2"
                    htmlFor="firstName"
                  >
                    First Name
                  </label>
                  <motion.input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={capitalized(formData.firstName)}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 bg-gray-700/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      errors.firstName ? "border-red-500" : "border-gray-600"
                    }`}
                    animate={shakeIfError("firstName")}
                  />
                  {errors.firstName && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    className="block text-gray-300 mb-2"
                    htmlFor="lastName"
                  >
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={capitalized(formData.lastName)}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 bg-gray-700/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      errors.lastName ? "border-red-500" : "border-gray-600"
                    }`}
                    animate={shakeIfError("lastName")}
                  />
                  {errors.lastName && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="text"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-300 mb-2" htmlFor="gender">
                    Gender
                  </label>
                  <motion.select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 bg-gray-700/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      errors.gender ? "border-red-500" : "border-gray-600"
                    }`}
                    animate={shakeIfError("gender")}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </motion.select>
                  {errors.gender && (
                    <p className="text-red-400 text-sm mt-1">{errors.gender}</p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-300 mb-2" htmlFor="age">
                    Age
                  </label>
                  <motion.input
                    id="age"
                    name="age"
                    type="number"
                    value={formData.age}
                    disabled={!isEditing}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-gray-700/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      errors.age ? "border-red-500" : "border-gray-600"
                    }`}
                    animate={shakeIfError("age")}
                  />
                  {errors.age && (
                    <p className="text-red-400 text-sm mt-1">{errors.age}</p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 mb-2" htmlFor="skills">
                  Skills
                </label>
                <motion.input
                  id="skills"
                  name="skills"
                  type="text"
                  value={formData.skills}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 bg-gray-700/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.skills ? "border-red-500" : "border-gray-600"
                  }`}
                  animate={shakeIfError("skills")}
                />
                {errors.skills && (
                  <p className="text-red-400 text-sm mt-1">{errors.skills}</p>
                )}
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-300 mb-2"
                  htmlFor="yearsOfExperience"
                >
                  Years of Experience
                </label>
                <motion.input
                  id="yearsOfExperience"
                  name="yearsOfExperience"
                  type="number"
                  value={formData.yearsOfExperience}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 bg-gray-700/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.yearsOfExperience
                      ? "border-red-500"
                      : "border-gray-600"
                  }`}
                  animate={shakeIfError("yearsOfExperience")}
                />
                {errors.yearsOfExperience && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.yearsOfExperience}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 mb-2" htmlFor="bio">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows="4"
                  placeholder="Tell others about yourself..."
                ></textarea>
              </div>

              <motion.button
                type="submit"
                className={`${
                  !isEditing && "hidden"
                } flex items-center justify-center gap-2 w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 rounded-lg text-white font-medium shadow-lg transition-all cursor-pointer`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  <>
                    <Save className="w-5 h-5" /> Save
                  </>
                )}
              </motion.button>
            </form>
          </div>
        </div>
      </motion.div>
      <ToastContainer />
    </div>
  );
};

export default Profile;
