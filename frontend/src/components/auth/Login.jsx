import { useState } from "react";
import "../../styles/Auth.css";
import { useNavigate } from "react-router-dom";
import Nav from "../landing_section/Nav";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("select role"); // State for the selected role
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Logging in:", { username, password, role }); // Include role in the console log

    // Make the fetch request to the /login endpoint
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        credentials: 'include', 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, role }), // Include role in the request body
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
        setRole("select role"); // Reset role to default
        navigate("/");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setMessage("Login failed. Please try again.");
    }
  };

  return (
    <>
    <Nav/>
    <section className="auth-bg">
      <div className="auth-container">
        <h2>Login</h2>
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
          <div className="input-group">
            <label htmlFor="role">Select Role</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="select role" disabled>Select Role</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
          <button type="submit">Login</button>
          <strong style={{ color: 'red' }}>{message}</strong>
        </form>
      </div>
    </section>
    </>
  );
};

export default Login;