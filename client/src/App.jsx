import { useState, useEffect } from 'react';
import './App.css';

/**
 * Venturenix LAB Memory Game
 * 
 * Design Philosophy:
 * - Glassmorphism UI with backdrop blur and semi-transparent cards
 * - Emerald green (#10B981) as primary accent color
 * - Dark background (#0F172A) for contrast
 * - Smooth 3D flip animations (600ms cubic-bezier)
 * - Responsive 3x4 grid layout with generous padding
 * - Poppins font for titles (bold), Inter for body text
 */

function App() {
  // Initialize cards with 6 unique pairs
  const initialCards = [
    { id: 1, pair: 1, src: '/img/animal1.jpg', flipped: false, matched: false },
    { id: 2, pair: 1, src: '/img/animal1.jpg', flipped: false, matched: false },
    { id: 3, pair: 2, src: '/img/animal2.jpg', flipped: false, matched: false },
    { id: 4, pair: 2, src: '/img/animal2.jpg', flipped: false, matched: false },
    { id: 5, pair: 3, src: '/img/animal3.jpg', flipped: false, matched: false },
    { id: 6, pair: 3, src: '/img/animal3.jpg', flipped: false, matched: false },
    { id: 7, pair: 4, src: '/img/animal4.jpg', flipped: false, matched: false },
    { id: 8, pair: 4, src: '/img/animal4.jpg', flipped: false, matched: false },
    { id: 9, pair: 5, src: '/img/animal5.jpg', flipped: false, matched: false },
    { id: 10, pair: 5, src: '/img/animal5.jpg', flipped: false, matched: false },
    { id: 11, pair: 6, src: '/img/animal6.jpg', flipped: false, matched: false },
    { id: 12, pair: 6, src: '/img/animal6.jpg', flipped: false, matched: false },
  ];

  const [cards, setCards] = useState(() => shuffleCards(initialCards));
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [successes, setSuccesses] = useState(0);
  const [imagesPreloaded, setImagesPreloaded] = useState(false);

  // Preload all images on component mount
  useEffect(() => {
    const preloadImages = async () => {
      const imageUrls = [
        '/img/animal1.jpg',
        '/img/animal2.jpg',
        '/img/animal3.jpg',
        '/img/animal4.jpg',
        '/img/animal5.jpg',
        '/img/animal6.jpg',
      ];

      const promises = imageUrls.map(
        (url) =>
          new Promise((resolve) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = resolve;
            img.src = url;
          })
      );

      await Promise.all(promises);
      setImagesPreloaded(true);
    };

    preloadImages();
  }, []);

  // Shuffle cards using Fisher-Yates algorithm
  function shuffleCards(cardsToShuffle) {
    const shuffled = [...cardsToShuffle];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Handle card click
  const handleCardClick = (id) => {
    if (flipped.includes(id) || matched.includes(id)) return;
    if (flipped.length === 2) return;

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    // Check for match when 2 cards are flipped
    if (newFlipped.length === 2) {
      const [firstId, secondId] = newFlipped;
      const firstCard = cards.find((c) => c.id === firstId);
      const secondCard = cards.find((c) => c.id === secondId);

      setAttempts((prev) => prev + 1);

      if (firstCard.pair === secondCard.pair) {
        // Match found
        setMatched((prev) => [...prev, firstId, secondId]);
        setSuccesses((prev) => prev + 1);
        setFlipped([]);
      } else {
        // No match - flip back after 1000ms
        setTimeout(() => {
          setFlipped([]);
        }, 1000);
      }
    }
  };

  // Reset game
  const handleNewGame = () => {
    setCards(shuffleCards(initialCards));
    setFlipped([]);
    setMatched([]);
    setAttempts(0);
    setSuccesses(0);
  };

  // Check if game is won
  const isGameWon = matched.length === 12;

  return (
    <div className="app-container">
      {/* Top Bar */}
      <div className="top-bar">
        <div className="stats">
          <div className="stat-item">
            <span className="stat-label">成功配對次數:</span>
            <span className="stat-value">{successes}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">嘗試配對次數:</span>
            <span className="stat-value">{attempts}</span>
          </div>
        </div>
        <button className="new-game-btn" onClick={handleNewGame}>
          新遊戲
        </button>
      </div>

      {/* Title */}
      <h1 className="game-title">Venturenix LAB Memory Game</h1>

      {/* Game Grid */}
      <div className="game-grid">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`card ${flipped.includes(card.id) || matched.includes(card.id) ? 'flipped' : ''} ${matched.includes(card.id) ? 'matched' : ''}`}
            onClick={() => handleCardClick(card.id)}
          >
            <div className="card-inner">
              {/* Front - face down */}
              <div className="card-front">
                <span className="card-text">Venturenix LAB</span>
              </div>
              {/* Back - face up */}
              <div className="card-back">
                {imagesPreloaded && <img src={card.src} alt="card" />}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Win Message */}
      {isGameWon && (
        <div className="win-message">
          <h2>🎉 恭喜你贏了！</h2>
          <p>成功配對次數: {successes} | 嘗試配對次數: {attempts}</p>
          <button className="new-game-btn" onClick={handleNewGame}>
            再玩一次
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
