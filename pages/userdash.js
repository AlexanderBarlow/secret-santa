import { useEffect, useState } from "react";
import axios from "axios";

export default function UserDashboard() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/api/user/dashboard");
        console.log(response)
        setUserData(response.data.user);
        console.log(response);
        
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong");
      }
    };

    fetchUserData();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome, {userData.email}</h1>
      <h2>Your Wish List</h2>
      <ul>
        {userData.wishList?.length > 0 ? (
          userData.wishList.map((item, index) => <li key={index}>{item}</li>)
        ) : (
          <p>No items in your wish list.</p>
        )}
      </ul>
    </div>
  );
}
