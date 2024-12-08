/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import axios from "axios";


const RateBook = ({id}) => {
  const [rating, setRating] = useState(0);
  const [alreadyRated, setAlreadyRated] = useState(false);

  // Fetch if the user or admin has already rated this book
  useEffect(() => {
    const checkRating = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/check-already-rated/${id}/ratings`,
          { withCredentials: true }
        );
        setAlreadyRated(response.data.alreadyRated);
      } catch (error) {
        console.error("Error checking rating:", error);
      }
    };
    checkRating();
  }, [alreadyRated, id]);

  const handleRatingChange = (e) => {
    setRating(e.target.value);
  };

  const submitRating = async () => {
    try {
      if (alreadyRated) {
        alert("You have already rated this book.");
        return;
      }

      const response = await axios.post(
        `http://localhost:5000/books/${id}/ratings`,
        { rating },
        { withCredentials: true }
      );

      if (response.status === 201) {
        alert("Rating submitted successfully.");
        setAlreadyRated(true); // Mark as rated to prevent further submissions
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  return (
    <div className="rate-book">
      {alreadyRated ? (
        <p>You have already rated this book.</p>
      ) : (
        <div>
          <label>
            Rate this book:
            <select value={rating} onChange={handleRatingChange}>
              <option value={0}>Select Rating</option>
              <option value={0.5}>0.5 - Very Poor</option>
              <option value={1}>1 - Poor</option>
              <option value={1.5}>1.5 - Below Average</option>
              <option value={2}>2 - Fair</option>
              <option value={2.5}>2.5 - Average</option>
              <option value={3}>3 - Good</option>
              <option value={3.5}>3.5 - Good Plus</option>
              <option value={4}>4 - Very Good</option>
              <option value={4.5}>4.5 - Excellent Minus</option>
              <option value={5}>5 - Excellent</option>
            </select>
          </label>
          <button onClick={submitRating}>Submit Rating</button>
        </div>
      )}
    </div>
  );
};

export default RateBook;
