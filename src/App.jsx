import "./App.css";
import { Routes, Route, Outlet } from "react-router-dom";
import TestAPI from "./components/TestAPI";
import ItemManager from "./components/ItemManager";
import UserManager from "./components/UserManager";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Profile from "./components/Profile";
import RequireAuth from "./middleware/RequireAuth";
import { useUser } from "./contexts/UserProvider";

import Navbar from "./components/Navbar";

const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<ItemManager />} />
        <Route path="/user" element={<UserManager />} />
        <Route path="/test_api" element={<TestAPI />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={
        <RequireAuth>
          <Logout />
        </RequireAuth>
      } />
      <Route path="/profile" element={
        <RequireAuth>
          <Profile />
        </RequireAuth>
      } />
    </Routes>
  )
}
export default App;
