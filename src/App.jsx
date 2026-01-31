import "./App.css";
import { Routes, Route } from "react-router-dom";
import TestAPI from "./components/TestAPI";
import ItemManager from "./components/ItemManager";

function App() {
  return (
    <Routes>
      <Route path="/" element={<ItemManager />} />
      <Route path="/test_api" element={<TestAPI />} />
    </Routes>
  )
}
export default App;
