import "../../styles/Comment.css";
import Button from "../Button";
// import comments from "../../../util/sample_comment.json";
import { useParams } from "react-router-dom";
import useStore from "../../store/store";
import { useState } from "react";

const Comment = () => {
  const { id } = useParams();
  const [inputComment, setInputComment] = useState("");
  const { addComment, book, fetchBook } = useStore((state) => ({
    addComment: state.addComment,
    book: state.book,
    fetchBook: state.fetchBook,
  }));

  const handleButtonClick = (e) => {
    e.preventDefault();
    if (inputComment.trim()) {
      addComment(id, inputComment);
      setInputComment("");
      fetchBook(id);
      console.log("Comment added:", inputComment);
    } else {
      console.log("Please enter a valid comment.");
    }
  };

  return (
    <section className="comment_container">
      <h1>Comments</h1>
      <div className="input_container">
        <input
          type="text"
          placeholder="Review product."
          value={inputComment}
          onChange={(e) => setInputComment(e.target.value)} // Update state on input change
        />
        <Button text={"Send"} onClick={handleButtonClick} />
      </div>
      {book?.comments?.length > 0 ? (
        book.comments.map((elem, index) => (
          <div key={index} className="comment">
            <h4>{elem.author}</h4>
            <p>{elem.comment}</p>
          </div>
        ))
      ) : (
        <strong className="no_comment">No Comments</strong>
      )}
    </section>
  );
};

export default Comment;
