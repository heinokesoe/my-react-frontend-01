import { useEffect, useState } from "react";
import "../App.css";

function TestAPI() {
  const [message, setMessage] = useState("...Loading...");
  
    useEffect(() => {
      async function fetchData() {
        const result = await fetch("http://localhost:3000/api/hello");
        const data = await result.json();
        console.log("result: ", result);
        console.log("data:", data);
        setMessage(data.message);
      }
      fetchData();
    }, []);
    return <div>Message: {message}</div>;
}

export default TestAPI;