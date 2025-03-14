import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  // Test back-end
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/api/data") // Flask API URL
      .then((response) => {
        setMessage(response.data.message);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    // <div>
    //   <p> Hello world </p>
    // </div>

    // Test back-end
    <div>
      <h1>{message}</h1>
    </div>
  );
}

export default App;
