import { useState } from "react";
import axios from "axios";
import "../styles/FeedbackForm.css"; // Assuming you save your CSS separately
import Nav from "./landing_section/Nav";

const FeedbackForm = () => {
  const [feedback, setFeedback] = useState("");
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Submitting...");
    try {
      const response = await axios.post(
        "http://localhost:5000/feedback",
        { feedback, title },
        { withCredentials: true } // Ensure the token is sent with the request
      );
      if (response.status === 201) {
        setStatus("Feedback submitted successfully!");
        setFeedback(""); 
        setTitle(""); 
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setStatus("Error submitting feedback.");
    }
  };

  return (
    <>
      <Nav />
      <div className="feedback-container">
        <h2>Submit Feedback</h2>
        <form onSubmit={handleSubmit} className="feedback-form">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your title here..."
            className="title-input"
            required
          />
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Enter your feedback here..."
            className="feedback-input"
            required
          ></textarea>
          <button type="submit" className="feedback-submit-btn">
            Submit Feedback
          </button>
        </form>
        {status && <p className="feedback-status">{status}</p>}
      </div>
    </>
  );
};

export default FeedbackForm;
