import "../../styles/BookList.css";
import BookCard from '../BookCard'
import data from '../../../util/sample_book.json';
import useStore from "../../store/store";
const BookList = () => {
  const { books } = useStore();

  return (
    <section className="book_list">
        {
            books.map((elem,index)=>{
                const combinedProps = { elem, index };
                return <BookCard {...combinedProps} key={index}/>
            })
        }
        
    </section>
  )
}

export default BookList