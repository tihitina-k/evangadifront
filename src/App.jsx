import { createContext, useEffect, useState } from "react";
import "./App.css";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "./utility/axios";
import AppRouter from "./routes/AppRouter.jsx";

export const UserState = createContext();

function App() {
  const [user, setUser] = useState(null); // null until loaded
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getUserData = async () => {
    try {
      const token = localStorage.getItem("Evangadi_Forum");
      if (!token) {
        navigate("/auth");
        setLoading(false);
        return;
      }

      const { data } = await axiosInstance.get("/user/check", {
        headers: { Authorization: "Bearer " + token },
      });

      setUser(data); // store user info
    } catch (error) {
      console.error(error);
      localStorage.removeItem("Evangadi_Forum");
      navigate("/auth");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // prevent rendering routes until user is loaded
  }

  return (
    <UserState.Provider value={{ user, setUser }}>
      <AppRouter />
    </UserState.Provider>
  );
}

export default App;
