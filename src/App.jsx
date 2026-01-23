import "./App.css";
import { Routes,Route } from "react-router-dom";
import TestAPI from "./components/TestAPI";

function App() {
  return (
    <Routes>
      <Route path="/" element={<h1>Home Page</h1>} />
      <Route path="/test_api" element={<TestAPI />} />
    </Routes>
  )
}
export default App;
