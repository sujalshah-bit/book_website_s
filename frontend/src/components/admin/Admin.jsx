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
    title: "",
    author: "",
    price: "",
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

  const validateBookInput = (bookData) => {
    const errors = [];

    // Title validation
    if (!bookData.title || bookData.title.trim().length === 0) {
      errors.push("Title is required");
    } else if (bookData.title.length > 255) {
      errors.push("Title must be less than 255 characters");
    }

    // Author validation
    if (!bookData.author || bookData.author.trim().length === 0) {
      errors.push("Author is required");
    } else if (bookData.author.length > 255) {
      errors.push("Author must be less than 255 characters");
    }

    // Price validation
    if (!bookData.price) {
      errors.push("Price is required");
    } else if (isNaN(bookData.price) || bookData.price < 0) {
      errors.push("Price must be a valid positive number");
    }

    // URL validation (optional field)
    if (bookData.url && bookData.url.length > 255) {
      errors.push("URL must be less than 255 characters");
    }

    // Image URL validation (optional field)
    if (bookData.image_url && bookData.image_url.length > 255) {
      errors.push("Image URL must be less than 255 characters");
    }

    // Categories validation (should be valid JSON)
    if (bookData.categories) {
      try {
        // If categories is a string, try to parse it
        if (typeof bookData.categories === 'string') {
          const categoriesArray = bookData.categories.split(',').map(cat => cat.trim());
          // Validate each category
          if (categoriesArray.some(cat => cat.length === 0)) {
            errors.push("Categories cannot be empty");
          }
        }
      } catch (error) {
        errors.push("Categories must be valid comma-separated values");
      }
    }

    return errors;
  };

  // Add a new book (server-side)
  const handleAddBook = async (e) => {
    e.preventDefault();
    const validationErrors = validateBookInput(form);
    
    if (validationErrors.length > 0) {
      alert(validationErrors.join('\n'));
      return;
    }

    try {
      await addBook({ ...form });
      setForm({
        id: "",
        title: "",
        author: "",
        description: "",
        price: "",
        image_url: "",
        url: "",
        categories: "",
      });
    } catch (error) {
      console.error("Error adding book:", error);
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
    const validationErrors = validateBookInput(form);
    
    if (validationErrors.length > 0) {
      alert(validationErrors.join('\n'));
      return;
    }

    try {
      await updateBook(form);
      setForm({
        id: "",
        title: "",
        author: "",
        description: "",
        price: "",
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>${book.price}</td>
                  <td className="description-cell">{book.description}</td>
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
