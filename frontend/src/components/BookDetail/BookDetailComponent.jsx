import Button from "../Button";
import "../../styles/BookDetailComponent.css";
import useStore from "../../store/store";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CommentsSection from './Comment'
import RateBook from './RateBook'
import axios from "axios";


const BookDetailComponent = () => {
  const { id } = useParams();
  const navigate = useNavigate()
  const { fetchWishlist, fetchBook, book, wishlist, fetchRatings, ratings, trackBookView} = useStore((state) => ({
    fetchWishlist: state.fetchWishlist,
    fetchRatings: state.fetchRatings,
    fetchBook: state.fetchBook,
    book: state.book,
    ratings: state.ratings,
    wishlist: state.wishlist,
    trackBookView: state.trackBookView,
  }));
  function calculateAverageRating(ratings) {
    if (!Array.isArray(ratings) || ratings.length === 0) {
        return 0; // Return 0 if the input is not an array or is empty
    }

    let totalRating = 0;
    let count = 0;

    ratings.forEach(rating => {
        if (rating.rating >= 0 && rating.rating <= 5) { // Ensure rating is within valid range
            totalRating += rating.rating;
            count++;
        }
    });

    return count > 0 ? parseFloat((totalRating / count).toFixed(1)) : 0; // Return average rounded to two decimal places
}

  // Function to add a book to the wishlist
  const addToWishlist = async (bookId) => {
    try {
      const existingBook = wishlist.find((book) => book.id === bookId);
      if (existingBook) {
        alert('This book is already in your wishlist.');
        return;
      }

      const response = await axios.post(
        'http://localhost:5000/wishlist',
        { book_id: bookId },
        { withCredentials: true }
      );
      if (response.status === 201) {
        alert('Book added to wishlist successfully');
        fetchWishlist(); // Update the wishlist after adding
      }
    } catch (error) {
      console.error('Error adding book to wishlist:', error);
    }
  };

  // Fetch book details when the component mounts or when id changes
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const response = await axios.get('http://localhost:5000/check-admin', {
          withCredentials: true, // Include cookies for authentication
        });
        
        if (response.status === 403) {
          navigate('/login')
        }
      } catch (error) {
        navigate('/login')
        console.error('Error checking admin status:', error);
      }
    };
    

    checkAdminStatus();
    fetchWishlist();
    if (id) {
      fetchBook(id);
      fetchRatings(id);
    }
  }, [id, fetchBook, fetchWishlist, navigate, fetchRatings]);

  useEffect(() => {
    if (book?.id) {
      trackBookView(book.id);
    }
  }, [book?.id, trackBookView]);

  return (
    <>
      {book && Object.keys(book).length > 0 ? (
        <section className="book_detail_component">
          <img src={`${book.image_url}`} alt={book.title} />
          <div className="info">
            <h1>{book.title}</h1>
            <p className="author">{book.author || "Unknown Author"}</p>
            <p className="ratings">{calculateAverageRating(ratings) || "No ratings available"} out of 5 Rated.</p>
            <p className="price">₹{book.price || "Price not available"}</p>
            <RateBook id={book.id}/>
            <p className="description">
              {book.description || "Description not available."}
            </p>
            <p className="mb-10">
              Categories: <span>{book.categories?.join(", ") || "No categories available"}</span>
            </p>
            <div className="btn_container">
              <Button text={"Add to wishlist"} onClick={()=>addToWishlist(book.id)} />
              <Button text={"Go to book"} url={`${book.url}`}/>
            </div>
          </div>
        </section>
      ) : (
        <div>Loading...</div>
      )}
      <CommentsSection/>
    </>
  );
};

export default BookDetailComponent;