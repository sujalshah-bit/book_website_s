/* eslint-disable react/prop-types */
import "../../styles/Nav.css";
import { FaHeart } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useSearchStore from "../../store/searchStore";
import Cookies from "js-cookie";

function Nav({ show_input = false }) {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    fetch("http://localhost:5000/logout", {
      method: "POST",
      credentials: "include", // Important: to include cookies in the request
    })
      .then((res) => res.json())
      .then(() => {
        setIsLoggedIn(false);
        navigate('/')
      })
      .catch((err) => console.error("Error:", err));
  };

  const setQuery = useSearchStore((state) => state.setQuery);

  const handleSearchChange = (e) => {
    setQuery(e.target.value); // Update the query in Zustand
  };

  useEffect(() => {
    // Check for token in local storage
    const token = Cookies.get("token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  return (
    <nav>
      <div>
        <h3><Link to={'/'}>World of Books</Link></h3>
      </div>
      {show_input ? (
        <div className="input_section">
          <input
            type="text"
            placeholder="Search"
            onChange={handleSearchChange}
          />
          <div id="searchBtn">
            <FaSearch fill="#000" />
          </div>
        </div>
      ) : null}

      <ul>
        {isLoggedIn ? (
          <>
            <li>
            <Link  to={"/Wishlist"}>
              <FaHeart style={{ cursor: "pointer" }} fill="#937DC2" />
            </Link>
            </li>
            <li style={{ cursor: "pointer" }}>
            <Link className="" to={"/feedback"}>
              <button>Feedback</button>
            </Link>
            </li>
            <li style={{ cursor: "pointer" }}>
              <button onClick={() => handleLogout()}>Log out</button>
            </li>
            <li style={{ cursor: "pointer" }}>
              <button>
                <Link className="signup_login" to={"/admin"}>
                  Admin Panel
                </Link>
              </button>
            </li>
            <li style={{ cursor: "pointer" }}>
              <button>
                <Link className="signup_login" to={"/books"}>
                  All Books
                </Link>
              </button>
            </li>
          </>
        ) : (
          <>
            <li style={{ cursor: "pointer" }}>
              <button>
                <Link className="signup_login" to={"/user/signup"}>
                  User Sign up
                </Link>
              </button>
            </li>
            <li style={{ cursor: "pointer" }}>
              <button>
                <Link className="signup_login" to={"/admin/signup"}>
                  Admin Sign up
                </Link>
              </button>
            </li>
            <li style={{ cursor: "pointer" }}>
              <button>
                <Link className="signup_login" to={"/login"}>
                  Login
                </Link>
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Nav;
