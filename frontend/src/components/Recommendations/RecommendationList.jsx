import { useEffect } from 'react';
import useStore from '../../store/store';
import BookCard from '../BookCard';
import '../../styles/RecommendationList.css';

const RecommendationList = () => {
  const { recommendations, fetchRecommendations } = useStore((state) => ({
    recommendations: state.recommendations,
    fetchRecommendations: state.fetchRecommendations,
  }));

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  if (!recommendations || recommendations.length === 0) {
    return (
      <section className="recommendations-section">
        <h2>Recommended for You</h2>
        <p>Start exploring books to get personalized recommendations!</p>
      </section>
    );
  }

  return (
    <section className="recommendations-section">
      <h2>Recommended for You</h2>
      <div className="recommendations-container">
        {recommendations.map((book, index) => (
          <BookCard 
            key={book.id} 
            elem={book} 
            index={index}
          />
        ))}
      </div>
    </section>
  );
};

export default RecommendationList; 