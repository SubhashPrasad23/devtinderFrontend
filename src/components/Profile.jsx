import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Edit, Save, Upload, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { capitalized } from "../utils/Helper";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addUser } from "../features/userSlice";


const Profile=()=> {
  const user = useSelector((store) => store?.user);

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

  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const dispatch = useDispatch();

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

    try {
      const form = new FormData();
      form.append("firstName", formData.firstName);
      form.append("lastName", formData.lastName);
      form.append("age", formData.age);
      form.append("gender", formData.gender);
      form.append("skills", formData.skills);
      form.append("yearOfExperience", formData.yearsOfExperience);
      form.append("bio", formData.bio);
      if (formData.profileImg) form.append("photoURL", formData.profileImg);

      const response = await axios.post(
        "http://localhost:7000/profile/edit",
        form,
        {
          withCredentials: true,
        }
      );
      console.log(response, "response");
      dispatch(addUser(response.data.data));
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
      setIsEditing(false);
    }
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center pb-5 px-5">
      <motion.div
        className="h-full w-full max-w-2xl mx-auto text-white rounded-2xl shadow-xl border border-gray-700 p-6 backdrop-blur-sm bg-gray-800/80 mb-4"
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
              {formData.profileImg && (
                <img
                  src={
                    typeof formData.profileImg === "string"
                      ? formData.profileImg
                      : URL.createObjectURL(formData.profileImg)
                  }
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
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={capitalized(formData.firstName)}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg"
                  />
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
                    className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg"
                  />
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
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 mb-2" htmlFor="age">
                    Age
                  </label>
                  <input
                    id="age"
                    name="age"
                    type="number"
                    value={formData.age}
                    disabled={!isEditing}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 mb-2" htmlFor="skills">
                  Skills
                </label>
                <input
                  id="skills"
                  name="skills"
                  type="text"
                  value={formData.skills}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg"
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-300 mb-2"
                  htmlFor="yearsOfExperience"
                >
                  Years of Experience
                </label>
                <input
                  id="yearsOfExperience"
                  name="yearsOfExperience"
                  type="number"
                  value={formData.yearsOfExperience}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg"
                />
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
                  className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg resize-none"
                  rows="4"
                  placeholder="Tell others about yourself..."
                ></textarea>
              </div>

              <motion.button
                type="submit"
                className={`${
                  !isEditing && "hidden"
                } flex items-center justify-center gap-2 w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 rounded-lg text-white font-medium shadow-lg transition-all`}
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
}

export default Profile