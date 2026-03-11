import { useState, useEffect } from 'react';

const getToday = () => new Date().toDateString();

export default function Quote({ displayMode = 'ombre' }) {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(getToday());

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const today = getToday();
        // Check if we have a cached quote for today
        const cached = localStorage.getItem('dailyQuote');
        if (cached) {
          const { quote: cachedQuote, date } = JSON.parse(cached);

          // If it's the same day, use cached quote
          if (date === today) {
            setQuote(cachedQuote);
            setLoading(false);
            return;
          }
        }

        // Fetch new quote from DummyJSON API (free, no auth required, reliable)
        // Get a random quote from their database (1-1454)
        const randomId = Math.floor(Math.random() * 1454) + 1;
        const response = await fetch(`https://dummyjson.com/quotes/${randomId}`);
        const data = await response.json();

        const newQuote = {
          text: data.quote,
          author: data.author
        };

        // Cache the quote with today's date
        localStorage.setItem('dailyQuote', JSON.stringify({
          quote: newQuote,
          date: today
        }));

        setQuote(newQuote);
      } catch (error) {
        console.error('Error fetching quote:', error);
        // Fallback quote if API fails
        setQuote({
          text: "Believe in yourself and all that you are!",
          author: "Inspiration"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchQuote();
  }, [currentDate]);

  // Check every minute if the date has changed
  useEffect(() => {
    const interval = setInterval(() => {
      const today = getToday();
      if (today !== currentDate) {
        setCurrentDate(today);
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [currentDate]);

  const getBgClass = () => {
    if (displayMode === 'ombre') {
      return 'bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200';
    } else if (displayMode === 'dark') {
      return 'bg-gray-700';
    } else if (displayMode === 'light') {
      return 'bg-white';
    } else {
      return 'bg-yellow-200';
    }
  };

  const bgClass = getBgClass();

  if (loading) {
    return (
      <div className={`${bgClass} rounded-2xl p-5 border-2 ${displayMode === 'dark' ? 'border-gray-600' : displayMode === 'light' ? 'border-gray-300' : 'border-yellow-100'} shadow-lg text-center`}>
        <p className={`${displayMode === 'dark' ? 'text-purple-300' : displayMode === 'light' ? 'text-gray-700' : 'text-purple-700'} font-bold`}>Loading inspiration...</p>
      </div>
    );
  }

  return (
    <div className={`${bgClass} rounded-2xl p-6 border-2 ${displayMode === 'dark' ? 'border-gray-600' : displayMode === 'light' ? 'border-gray-300' : 'border-yellow-100'} shadow-lg text-center`}>
      <div className="text-4xl mb-3">✨</div>
      <p className={`${displayMode === 'dark' ? 'text-purple-300' : displayMode === 'light' ? 'text-gray-800' : 'text-purple-700'} font-bold text-xl italic mb-2`}>
        "{quote.text}"
      </p>
      <p className={`${displayMode === 'dark' ? 'text-purple-400' : displayMode === 'light' ? 'text-gray-600' : 'text-purple-600'} text-sm`}>
        — {quote.author}
      </p>
    </div>
  );
}
