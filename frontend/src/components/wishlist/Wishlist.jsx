import { useEffect } from "react";
// import book from "../../../demo.json";
import "../../styles/Wishlist.css";
import Nav from "../landing_section/Nav";
import useStore from "../../store/store";

const Wishlist = () => {
    const { wishlist,  fetchWishlist, removeWishlist } = useStore((state) => ({
        fetchWishlist: state.fetchWishlist,
        removeWishlist: state.removeWishlist,
        wishlist: state.wishlist,
      }));
        // Function to handle removing an item from the wishlist
  const handleRemoveFromWishlist = async (bookId) => {
    try {
      await removeWishlist(bookId); // Call the function to remove the book
      await fetchWishlist(); // Re-fetch the updated wishlist to trigger a rerender
    } catch (error) {
      console.error('Error removing book from wishlist:', error);
    }
  };
      useEffect(() => {
        fetchWishlist();
      }, [fetchWishlist, removeWishlist]);
  return (
    <>
    <Nav/>
        <h1 style={{textAlign:"center"}}>Wishlist</h1>
    <div className="wishlist-container">
      {wishlist.map((book, index) => (
        <div key={index} className="wishlist-item">
          <img src={book.image_url} alt={book.title} className="book-image" />
          <div className="book-info">
            <h3 className="book-title">{book.title}</h3>
            <p className="book-author">By: {book.author}</p>
            <p className="book-price">Price: ${book.price / 100}</p>
            <p className="book-rating">
              Rating: {book.rating} / 5 ({book.reviews_count} reviews)
            </p>
            <p className="book-categories">
              Categories: {book.categories.join(", ")}
            </p>
            <a
              href={book.url}
              target="_blank"
              rel="noopener noreferrer"
              className="book-link"
            >
              View on Amazon
            </a>
            <button
                onClick={() => handleRemoveFromWishlist(book.id)} // Call the handler function
                className="book-link cancel_button"
              >
                Remove from wishlist
              </button>
          </div>
        </div>
      ))}
    </div>
    </>
  );
};

export default Wishlist;
