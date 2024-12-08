import { create } from 'zustand';
import axios from 'axios';

const useStore = create((set) => ({
  // Initial state for books and user information
  books: [],
  book:[],
  wishlist:[],
  ratings: [],
  user: {
    name: '',
    email: '',
    role: 'user', // Can be 'admin' or 'user'
  },

  // Function to set books (for local state)
  setBooks: (newBooks) => set({ books: newBooks }),

  // Function to fetch all books from API
  fetchBooks: async () => {
    try {
      const response = await axios.get('http://localhost:5000/books', {
        withCredentials: true,
      });
      set({ books: response.data });
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  },

  fetchBook: async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/book/${id}`, {
        withCredentials: true,
      });
      set({ book: response.data });
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  },

  // Function to add a book (Admin only)
  addBook: async (newBook) => {
    try {
      const response = await axios.post('http://localhost:5000/books', newBook, {
        withCredentials: true,
      });
      if (response.status === 201) {
        set((state) => ({
          books: [...state.books, { ...newBook, id: response.data.id }],
        }));
      }
    } catch (error) {
      console.error('Error adding book:', error);
    }
  },

  // Function to update a book (Admin only)
  updateBook: async (updatedBook) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/books/${updatedBook.id}`,
        updatedBook,
        { withCredentials: true }
      );
      if (response.status === 200) {
        set((state) => ({
          books: state.books.map((book) =>
            book.id === updatedBook.id ? updatedBook : book
          ),
        }));
      }
    } catch (error) {
      console.error('Error updating book:', error);
    }
  },

  // Function to delete a book (Admin only)
  deleteBook: async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/books/${id}`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        set((state) => ({
          books: state.books.filter((book) => book.id !== id),
        }));
      }
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  },

  // Function to set user information
  setUser: (userInfo) => set({ user: userInfo }),

  // Function to login user or admin
  login: async (credentials) => {
    try {
      const response = await axios.post('http://localhost:5000/login', credentials, {
        withCredentials: true,
      });
      set({ user: response.data });
      return response;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  // Function to logout
  logout: async () => {
    try {
      await axios.post('http://localhost:5000/logout', {}, { withCredentials: true });
      set({ user: { name: '', email: '', role: 'user' }, books: [] });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  },

  
  // Function to add a comment
  addComment: async (bookId, comment) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/books/${bookId}/comments`,
        { comment },
        { withCredentials: true }
      );
      if (response.status === 201) {
        console.log('Comment added successfully');
        // Optionally, you can fetch the updated comments or update the local state
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  },

  // Function to add a rating
  addRating: async (bookId, rating) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/books/${bookId}/ratings`,
        { rating },
        { withCredentials: true }
      );
      if (response.status === 201) {
        console.log('Rating added successfully');
        // Optionally, you can fetch the updated ratings or update the local state
      }
    } catch (error) {
      console.error('Error adding rating:', error);
    }
  },
  
  // Function to fetch the wishlist from the backend
  fetchWishlist : async () => {
    try {
      const response = await axios.get('http://localhost:5000/wishlist', {
        withCredentials: true, // Ensures cookies (tokens) are sent
      });
      set({ wishlist: response.data });
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  },
  removeWishlist : async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/wishlist/${id}`, {
        withCredentials: true, // Ensures cookies (tokens) are sent
      });
      if (response.status === 201) {
        console.log('wishlist removed successfully');
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  },
  
  fetchRatings : async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/books/${id}/ratings`, { withCredentials: true });
      set({ ratings: response.data });
    } catch (error) {
        console.error("Error fetching ratings:", error);
    }
  },

  recommendations: [],

  trackBookView: async (bookId) => {
    try {
      await axios.post(`http://localhost:5000/books/${bookId}/view`, {}, {
        withCredentials: true
      });
    } catch (error) {
      console.error('Error tracking book view:', error);
    }
  },

  fetchRecommendations: async () => {
    try {
      const response = await axios.get(`http://localhost:5000/recommendations`, {
        withCredentials: true
      });
      set({ recommendations: response.data });
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  },
}));

export default useStore;
