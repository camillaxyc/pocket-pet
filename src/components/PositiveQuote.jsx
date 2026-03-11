import { useState, useEffect } from 'react';

const getToday = () => new Date().toDateString();

const weatherEmojis = {
  'Clear': '☀️',
  'Clouds': '☁️',
  'Rain': '🌧️',
  'Drizzle': '🌦️',
  'Thunderstorm': '⛈️',
  'Snow': '❄️',
  'Mist': '🌫️',
  'Fog': '🌫️',
  'Haze': '🌫️'
};

// Helper function to get emoji from weather code
const getWeatherEmoji = (weatherCode) => {
  if (weatherCode === 0) return '☀️';
  if ([1, 2, 3].includes(weatherCode)) return '⛅';
  if ([45, 48].includes(weatherCode)) return '🌫️';
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode)) return '🌧️';
  if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) return '❄️';
  if ([95, 96, 99].includes(weatherCode)) return '⛈️';
  return '☀️';
};

export default function PositiveQuote({ zipcode, displayMode = 'ombre' }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showWeeklyForecast, setShowWeeklyForecast] = useState(false);
  const [unit, setUnit] = useState(() => {
    // Load preference from localStorage, default to Fahrenheit
    return localStorage.getItem('tempUnit') || 'fahrenheit';
  });


  useEffect(() => {
    // Default to New York zipcode if none provided
    const activeZipcode = zipcode && zipcode.trim() !== '' ? zipcode : '10001';

    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        // First, get coordinates from zipcode using zippopotam.us (free, no API key)
        const geoResponse = await fetch(`https://api.zippopotam.us/us/${activeZipcode}`);

        if (!geoResponse.ok) {
          throw new Error('Invalid zipcode');
        }

        const geoData = await geoResponse.json();
        const lat = geoData.places[0].latitude;
        const lon = geoData.places[0].longitude;
        const location = `${geoData.places[0]['place name']}, ${geoData.places[0]['state abbreviation']}`;

        // Then get weather from open-meteo (free, no API key needed)
        // Include both current weather and 7-day daily min/max temperatures
        const weatherResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&temperature_unit=${unit}&timezone=auto&forecast_days=7`
        );

        if (!weatherResponse.ok) {
          throw new Error('Weather data not available');
        }

        const weatherData = await weatherResponse.json();
        const weatherCode = weatherData.current.weather_code;

        // Get today's min and max temperatures
        const tempMin = Math.round(weatherData.daily.temperature_2m_min[0]);
        const tempMax = Math.round(weatherData.daily.temperature_2m_max[0]);

        // Get 7-day forecast
        const weeklyForecast = weatherData.daily.time.map((date, index) => ({
          date: new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
          tempMin: Math.round(weatherData.daily.temperature_2m_min[index]),
          tempMax: Math.round(weatherData.daily.temperature_2m_max[index]),
          weatherCode: weatherData.daily.weather_code[index]
        }));

        // Map weather codes to conditions and emojis
        let condition = 'Clear';
        let emoji = '☀️';

        if (weatherCode === 0) {
          condition = 'Clear';
          emoji = '☀️';
        } else if ([1, 2, 3].includes(weatherCode)) {
          condition = 'Partly Cloudy';
          emoji = '⛅';
        } else if ([45, 48].includes(weatherCode)) {
          condition = 'Foggy';
          emoji = '🌫️';
        } else if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode)) {
          condition = 'Rainy';
          emoji = '🌧️';
        } else if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
          condition = 'Snowy';
          emoji = '❄️';
        } else if ([95, 96, 99].includes(weatherCode)) {
          condition = 'Thunderstorm';
          emoji = '⛈️';
        }

        const weatherInfo = {
          temp: Math.round(weatherData.current.temperature_2m),
          tempMin: tempMin,
          tempMax: tempMax,
          condition: condition,
          emoji: emoji,
          location: location,
          weeklyForecast: weeklyForecast
        };

        setWeather(weatherInfo);

        // Cache weather data by date
        const today = getToday();
        const weatherCache = JSON.parse(localStorage.getItem('weatherCache') || '{}');
        weatherCache[today] = weatherInfo;
        localStorage.setItem('weatherCache', JSON.stringify(weatherCache));

        // Fade in after data is loaded
        if (isTransitioning) {
          setTimeout(() => setIsTransitioning(false), 50);
        }
      } catch (err) {
        console.error('Weather fetch error:', err);
        setError(err.message);
        setWeather(null);
        setIsTransitioning(false);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [zipcode, unit]);

  const toggleUnit = () => {
    setIsTransitioning(true);
    // Wait for fade out, then switch unit
    setTimeout(() => {
      const newUnit = unit === 'fahrenheit' ? 'celsius' : 'fahrenheit';
      setUnit(newUnit);
      localStorage.setItem('tempUnit', newUnit);
    }, 200); // Match the CSS transition duration
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  const getBgClass = () => {
    if (displayMode === 'ombre') {
      return 'bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200';
    } else if (displayMode === 'dark') {
      return 'bg-gray-700';
    } else if (displayMode === 'light') {
      return 'bg-white';
    } else {
      return 'bg-blue-200';
    }
  };

  const bgClass = getBgClass();
  const unitSymbol = unit === 'fahrenheit' ? 'F' : 'C';
  const switchToUnit = unit === 'fahrenheit' ? 'Celsius' : 'Fahrenheit';

  const getButtonClass = () => {
    if (displayMode === 'ombre') {
      return 'bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white';
    } else if (displayMode === 'dark') {
      return 'bg-purple-300 hover:bg-purple-400 text-gray-800';
    } else if (displayMode === 'light') {
      return 'bg-blue-400 hover:bg-blue-500 text-white';
    } else if (displayMode === 'pastel') {
      return 'bg-purple-300 hover:bg-purple-400 text-white';
    }
    return 'bg-purple-400 hover:bg-purple-500 text-white';
  };

  return (
    <div className={`${bgClass} rounded-2xl p-5 border-2 ${displayMode === 'dark' ? 'border-gray-600' : displayMode === 'light' ? 'border-gray-300' : 'border-blue-100'} shadow-lg text-center h-full flex flex-col items-center justify-center relative`}>
      <div className="absolute top-3 right-3 flex gap-2">
        <button
          onClick={toggleUnit}
          className={`${getButtonClass()} px-3 py-1 rounded-lg text-xs font-semibold transition-all shadow-sm cursor-pointer`}
        >
          Switch to {switchToUnit}
        </button>
        {weather && (
          <button
            onClick={() => setShowWeeklyForecast(!showWeeklyForecast)}
            className={`${getButtonClass()} px-3 py-1 rounded-lg text-xs font-semibold transition-all shadow-sm cursor-pointer`}
          >
            {showWeeklyForecast ? 'Today' : 'Week'}
          </button>
        )}
      </div>

      <div
        className="transition-opacity duration-200 ease-in-out w-full"
        style={{ opacity: isTransitioning ? 0 : 1 }}
      >
        {loading ? (
          <p className={`${displayMode === 'dark' ? 'text-purple-300' : displayMode === 'light' ? 'text-gray-700' : 'text-purple-700'} font-bold`}>Loading weather...</p>
        ) : weather ? (
          <>
            {!showWeeklyForecast ? (
              // Today's weather view
              <>
                <p className={`${displayMode === 'dark' ? 'text-purple-300' : displayMode === 'light' ? 'text-gray-800' : 'text-purple-700'} text-lg font-bold mb-2`}>{today}</p>
                <div className="text-5xl mb-2">{weather.emoji}</div>
                <p className={`${displayMode === 'dark' ? 'text-purple-300' : displayMode === 'light' ? 'text-gray-800' : 'text-purple-700'} font-bold text-2xl mb-1`}>
                  {weather.temp}°{unitSymbol}
                </p>
                <p className={`${displayMode === 'dark' ? 'text-purple-400' : displayMode === 'light' ? 'text-gray-700' : 'text-purple-600'} text-sm mb-1`}>
                  {weather.tempMin}°{unitSymbol} - {weather.tempMax}°{unitSymbol}
                </p>
                <p className={`${displayMode === 'dark' ? 'text-purple-400' : displayMode === 'light' ? 'text-gray-700' : 'text-purple-600'} text-lg`}>
                  {weather.condition}
                </p>
                <p className={`${displayMode === 'dark' ? 'text-purple-500' : displayMode === 'light' ? 'text-gray-600' : 'text-purple-500'} text-sm mt-1`}>
                  {weather.location}
                </p>
              </>
            ) : (
              // Weekly forecast view
              <div className="w-full">
                <p className={`${displayMode === 'dark' ? 'text-purple-300' : displayMode === 'light' ? 'text-gray-800' : 'text-purple-700'} text-lg font-bold mb-3`}>7-Day Forecast</p>
                <p className={`${displayMode === 'dark' ? 'text-purple-500' : displayMode === 'light' ? 'text-gray-600' : 'text-purple-500'} text-sm mb-3`}>
                  {weather.location}
                </p>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {weather.weeklyForecast.map((day, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg ${
                        displayMode === 'dark'
                          ? 'bg-gray-600/50'
                          : displayMode === 'light'
                          ? 'bg-gray-100'
                          : 'bg-white/50'
                      }`}
                    >
                      <span className={`${displayMode === 'dark' ? 'text-purple-300' : displayMode === 'light' ? 'text-gray-800' : 'text-purple-700'} text-sm font-semibold w-24 text-left`}>
                        {day.date}
                      </span>
                      <span className="text-xl">{getWeatherEmoji(day.weatherCode)}</span>
                      <span className={`${displayMode === 'dark' ? 'text-purple-400' : displayMode === 'light' ? 'text-gray-700' : 'text-purple-600'} text-sm font-medium`}>
                        <span className="text-blue-600 dark:text-blue-400">{day.tempMin}°</span>
                        {' / '}
                        <span className="text-red-600 dark:text-red-400">{day.tempMax}°</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : error ? (
          <p className={`${displayMode === 'dark' ? 'text-purple-400' : displayMode === 'light' ? 'text-gray-600' : 'text-purple-600'} text-sm`}>
            Weather unavailable - check your zipcode
          </p>
        ) : (
          <p className={`${displayMode === 'dark' ? 'text-purple-300' : displayMode === 'light' ? 'text-gray-700' : 'text-purple-700'} font-bold`}>Loading...</p>
        )}
      </div>
    </div>
  );
}
