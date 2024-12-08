// import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import "../styles/Footer.css"
import { Link } from 'react-router-dom';
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-wrapper">
      <Link to={'#'}>About Us</Link>
      <Link to={'#'}>Contact Us</Link>
      </div>
    </footer>
    // <footer className="footer">
    //   <div className="footer-wrapper">
    //     <div className="footer-column">
    //       <h3 className="column-title">About Us</h3>
    //       <a href="#" className="column-link">
    //         Our Story
    //       </a>
    //       <a href="#" className="column-link">
    //         Meet the Team
    //       </a>
    //       <a href="#" className="column-link">
    //         Contact Us
    //       </a>
    //     </div>
    //     <div className="footer-column">
    //       <h3 className="column-title">Books</h3>
    //       <a href="#" className="column-link">
    //         Fiction
    //       </a>
    //       <a href="#" className="column-link">
    //         Non-Fiction
    //       </a>
    //       <a href="#" className="column-link">
    //         Bestsellers
    //       </a>
    //     </div>
    //     <div className="footer-column">
    //       <h3 className="column-title">Help</h3>
    //       <a href="#" className="column-link">
    //         FAQs
    //       </a>
    //       <a href="#" className="column-link">
    //         Shipping Info
    //       </a>
    //       <a href="#" className="column-link">
    //         Returns
    //       </a>
    //     </div>
    //     <div className="footer-column">
    //       <h3 className="column-title">Follow Us</h3>
    //       <div className="social-icons">
    //         <a href="#" className="social-icon">
    //           <FaFacebookF />
    //         </a>
    //         <a href="#" className="social-icon">
    //           <FaTwitter />
    //         </a>
    //         <a href="#" className="social-icon">
    //           <FaInstagram />
    //         </a>
    //         <a href="#" className="social-icon">
    //           <FaYoutube />
    //         </a>
    //       </div>
    //     </div>
    //   </div>
    // </footer>
  );
};

export default Footer;