import "./App.css";
import { Routes, Route } from "react-router-dom";
import TestAPI from "./components/TestAPI";
import ItemManager from "./components/ItemManager";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Profile from "./components/Profile";
import RequireAuth from "./middleware/RequireAuth";
import { useUser } from "./contexts/UserProvider";

function App() {
  return (
    <Routes>
      <Route path="/" element={<ItemManager />} />
      <Route path="/test_api" element={<TestAPI />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={
        <RequireAuth>
          <Profile />
        </RequireAuth>
      } />
      <Route path="/logout" element={
        <RequireAuth>
          <Logout />
        </RequireAuth>
      } />
    </Routes>
  )
}
export default App;
