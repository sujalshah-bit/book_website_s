import '../../styles/HeroSection.css'; 

const HeroSection = () => {
    return (
        <section className="hero-section">
            <div className="hero-content">
                <div className="text-content">
                    <h1>Welcome to the World of Books</h1>
                    <p>
                        Discover a universe of knowledge and imagination. Join us to explore our vast collection of books.
                    </p>
                    <button className="hero-button">Explore Now</button>
                </div>
                <div className="image-content">
                    <img src="/src/assets/hero_book_image.png" alt="Books" />
                </div>
            </div>
        </section>
    );
};

export default HeroSection;