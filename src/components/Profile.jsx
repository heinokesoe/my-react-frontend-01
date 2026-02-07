import { useUser } from "../contexts/UserProvider";
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

export default function Profile() {
  const { logout } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({});
  const [hasImage, setHasImage] = useState(false);
  const fileInputRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL;

  console.log(`URL => ${API_URL}`);

  async function onUpdateImage() {
    const file = fileInputRef.current?.files[0];
    if (!file) {
      alert("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_URL}/api/user/profile/image`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (response.ok) {
        alert("Image updated successfully.");
        fetchProfile();
      } else {
        alert("Failed to update image.");
      }
    } catch (err) {
      alert("Error uploading image." + err);
    }
  }

  async function fetchProfile() {
    const result = await fetch(`${API_URL}/api/user/profile`, {
      credentials: "include",
    });

    if (result.status == 401) {
      logout();
    } else {
      const data = await result.json();
      if (data.profileImage != null) {
        console.log("has image...");
        setHasImage(true);
      }
      console.log("data: ", data);
      setIsLoading(false);
      setData(data);
    }
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-4xl font-bold text-gray-800">My Profile</h1>
          <Link
            to="/logout"
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg transition-all shadow-md hover:shadow-lg"
          >
            Logout
          </Link>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
            <div className="text-xl font-semibold text-gray-700">
              Loading...
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
            {/* Profile Image Section */}
            <div className="flex flex-col items-center mb-8">
              {hasImage ? (
                <img
                  src={`${API_URL}${data.profileImage}`}
                  alt="Profile"
                  className="w-40 h-40 rounded-full object-cover border-4 border-indigo-200 shadow-lg mb-4"
                />
              ) : (
                <div className="w-40 h-40 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-5xl font-bold shadow-lg mb-4">
                  {data.firstname?.[0]}
                  {data.lastname?.[0]}
                </div>
              )}

              <div className="flex gap-3 items-center">
                <input
                  type="file"
                  id="profileImage"
                  name="profileImage"
                  ref={fileInputRef}
                  accept="image/*"
                  className="text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                />
                <button
                  onClick={onUpdateImage}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-lg transition-all shadow-md hover:shadow-lg"
                >
                  Update Image
                </button>
              </div>
            </div>

            {/* Profile Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  User ID
                </label>
                <p className="text-lg text-gray-800 font-mono bg-gray-50 px-4 py-3 rounded-lg">
                  {data._id}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Email
                </label>
                <p className="text-lg text-gray-800 bg-gray-50 px-4 py-3 rounded-lg">
                  {data.email}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  First Name
                </label>
                <p className="text-lg text-gray-800 bg-gray-50 px-4 py-3 rounded-lg">
                  {data.firstname}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Last Name
                </label>
                <p className="text-lg text-gray-800 bg-gray-50 px-4 py-3 rounded-lg">
                  {data.lastname}
                </p>
              </div>

              {data.username && (
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    Username
                  </label>
                  <p className="text-lg text-gray-800 bg-gray-50 px-4 py-3 rounded-lg">
                    {data.username}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
