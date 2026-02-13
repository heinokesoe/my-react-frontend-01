import { useUser } from "../contexts/UserProvider";
import { useEffect, useState, useRef } from "react";

export default function Profile() {
  const { user, logout } = useUser();
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
      const response = await fetch(`${API_URL}/api/user/profile`, {
        method: "POST",
        body: formData,
        credentials: "include"
      });
      if (response.ok) {
        alert("Image updated successfully.");
        fetchProfile();
      } else {
        alert("Failed to update image.");
      }
    } catch (err) {
      alert("Error uploading image.");
    }
  }
  async function fetchProfile() {
    try {
      const result = await fetch(`${API_URL}/api/user/profile`, {
        credentials: "include"
      });
      if (result.status === 401) {
        logout();
      } else if (!result.ok) {
        console.error("Failed to fetch profile:", result.statusText);
        setIsLoading(false);
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
    } catch (error) {
      console.error("Error fetching profile:", error);
      setIsLoading(false);
    }
  }
  useEffect(() => {
    fetchProfile();
  }, []);
  return (
    <div>
      <h3>Profile...</h3>
      {
        isLoading ?
          <div>Loading...</div> :
          <div>
            ID: {data._id} <br />
            Email: {data.email} <br />
            First Name: {data.firstname} <br />
            Last Name: {data.lastname} <br />
            Image: {hasImage && <img src={`${API_URL}${data.profileImage}`}
              width={150} height={150} />} <input type="file" id="profileImage"
                name="profileImage" ref={fileInputRef} /> <button onClick={onUpdateImage}>Update
                  Image</button> <br />
          </div>
      }
    </div>
  )
}
