// import HeroSection from './HeroSection'
import Nav from './Nav'
import HeroSection from './HeroSection'
import Footer from '../Footer'

import BookList from './BookList'
import { useEffect } from 'react';
import useStore from '../../store/store';

function LandingPage() {
  const { fetchBooks } = useStore();

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);
  return (
    <section>
        <Nav/>
        {/* <HeroSection/> */}
        <BookList/>
        <Footer/>
    </section>
  )
}

export default LandingPage