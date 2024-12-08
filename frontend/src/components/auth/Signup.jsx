/* eslint-disable react/prop-types */
import { useState } from "react";
import "../../styles/Auth.css";
import { useNavigate } from "react-router-dom";

const AdminSignup = ({text}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Signing up:", { username, password });

    // Make the fetch request to the /admin/signup endpoint
    try {
      const response = await fetch(`http://localhost:5000/${text === "Admin" ? "admin" : "user"}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      // Handle the response
      if (!response.ok) {
        const errorMessage = await response.text();
        setMessage(`Error: ${errorMessage}`);
      } else {
        const data = await response.json();
        setMessage(data.msg);
        setUsername("");
        setPassword("");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setMessage("Signup failed. Please try again.");
    }
  };

  return (
    <section className="auth-bg">
      <div className="auth-container">
        <h2>{text} Signup</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Signup</button>
        </form>
        {message && <p>{message}</p>} {/* Display the message */}
      </div>
    </section>
  );
};

export default AdminSignup;
