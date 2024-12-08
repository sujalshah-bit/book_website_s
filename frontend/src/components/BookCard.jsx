/* eslint-disable react/prop-types */
import "../styles/BookCard.css";
import Button from "./Button";

const BookCard = ({ elem }) => {
  return (
    <div className='card'>
        <img src={`${elem.image_url}`} alt="" />
        <div className="card-info">
            <h1 className="ellipse">{elem.title}</h1>
            <p style={{color:"#4D4C4C"}}>{elem.brand}</p>
            <p>₹ {elem.price}</p>
            <Button text={"View"} url={`/book/${elem.id}`}/>
        </div>
    </div>
  )
}

export default BookCard