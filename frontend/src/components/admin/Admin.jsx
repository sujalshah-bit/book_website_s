import { useEffect, useState } from "react";
import "../../styles/Admin.css";
import Nav from "../landing_section/Nav";
import useStore from "../../store/store"; // Assuming you have this setup for Zustand store
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import axios from "axios";

const Admin = () => {
  const navigate = useNavigate()
  const { books, fetchBooks, addBook, updateBook, deleteBook } = useStore();
  const [form, setForm] = useState({
    id: "",
    // ISBN10: "",
    title: "",
    author: "",
    price: "",
    // rating: "",
    // availability: "",
    // reviews_count: "",
    image_url: "",
    url: "",
    categories: "",
  });
  const [isEditing, setIsEditing] = useState(false);

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
    fetchBooks(); // Fetch books from the API when the component mounts
  }, [fetchBooks, navigate]);

  // Handle form input changes
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Add a new book (server-side)
  const handleAddBook = async (e) => {
    e.preventDefault();
    if (
      form.title &&
      form.author &&
      form.price &&
      form.description &&
      // form.rating &&
      // form.availability &&
      // form.ISBN10 &&
      // form.reviews_count &&
      form.image_url &&
      form.url &&
      form.categories
    ) {
      try {
        await addBook({ ...form });
        setForm({
          id: "",
          // ISBN10: "",
          title: "",
          author: "",
          description: "",
          price: "",
          // rating: "",
          // availability: "",
          // reviews_count: "",
          image_url: "",
          url: "",
          categories: "",
        });
      } catch (error) {
        console.error("Error adding book:", error);
      }
    }
  };

  // Set book data to the form for editing
  const handleEditBook = (book) => {
    setForm(book);
    setIsEditing(true);
  };

  // Update book details (server-side)
  const handleUpdateBook = async (e) => {
    e.preventDefault();
    try {
      await updateBook(form);
      setForm({
        id: "",
        // ISBN10: "",
        title: "",
        author: "",
        price: "",
        description: "",
        // rating: "",
        // availability: "",
        // reviews_count: "",
        image_url: "",
        url: "",
        categories: "",
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating book:", error);
    }
  };

  // Delete a book (server-side)
  const handleDeleteBook = async (id) => {
    try {
      await deleteBook(id);
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  return (
    <>
      <Nav />
      <div className="admin-container">
        <h2>Admin Panel - Manage Books</h2>

        <form
          className="admin-form"
          onSubmit={isEditing ? handleUpdateBook : handleAddBook}
        >
          <input
            type="text"
            name="title"
            value={form.title}
            placeholder="Book Title"
            onChange={handleChange}
          />
          <input
            type="text"
            name="author"
            value={form.author}
            placeholder="Author"
            onChange={handleChange}
          />
          <input
            type="number"
            name="price"
            value={form.price}
            placeholder="Price"
            onChange={handleChange}
          />
          {/* <input
            type="text"
            name="ISBN10"
            value={form.ISBN10}
            placeholder="ISBN-10"
            onChange={handleChange}
          /> */}
          {/* <input
            type="number"
            name="reviews_count"
            value={form.reviews_count}
            placeholder="Reviews Count"
            onChange={handleChange}
          /> */}
          <input
            type="text"
            name="image_url"
            value={form.image_url}
            placeholder="Image URL"
            onChange={handleChange}
          />
          <input
            type="text"
            name="url"
            value={form.url}
            placeholder="Amazon URL"
            onChange={handleChange}
          />
          <input
            type="text"
            name="description"
            value={form.description}
            placeholder="Description"
            onChange={handleChange}
          />
          <input
            type="text"
            name="categories"
            value={form.categories}
            placeholder="Categories (comma-separated)"
            onChange={handleChange}
          />
          {/* <input
            type="number"
            name="rating"
            value={form.rating}
            placeholder="Rating"
            min="0"
            max="5"
            step="0.1"
            onChange={handleChange}
          /> */}
          {/* <select name="availability" value={form.availability} onChange={handleChange}>
            <option value="">Select Availability</option>
            <option value="In Stock">In Stock</option>
            <option value="Out of Stock">Out of Stock</option>
            <option value="Only 13 left in stock - order soon.">
              Only 13 left in stock - order soon.
            </option>
          </select> */}

          <button type="submit" className="submit-btn">
            {isEditing ? "Update Book" : "Add Book"}
          </button>
        </form>

        <h3>Books Added</h3>
        {books.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Price</th>
                <th>description</th>
                {/* <th>Reviews</th> */}
                {/* <th>Rating</th> */}
                {/* <th>Availability</th> */}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>${book.price}</td>
                  <td>{book.description}</td>
                  {/* <td>{book.reviews_count}</td> */}
                  {/* <td>{book.rating}</td> */}
                  {/* <td>{book.availability}</td> */}
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => handleEditBook(book)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteBook(book.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No books added yet.</p>
        )}
      </div>
    </>
  );
};

export default Admin;
