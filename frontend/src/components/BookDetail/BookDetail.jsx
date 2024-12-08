import Nav from '../landing_section/Nav'
import BookDetailComponent from './BookDetailComponent'
import RecommendationList from '../Recommendations/RecommendationList'

export const BookDetail = () => {
  return (
    <section className='bg-grey'>
        <Nav/>
    <section className='w-lg'>
        <BookDetailComponent/>
        <RecommendationList/>
    </section>
    </section>
  )
}

export default BookDetail
