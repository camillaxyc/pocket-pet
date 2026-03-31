import { useState, useEffect } from 'react';

const getToday = () => new Date().toDateString();

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

export default function WeatherWidget({ zipcode, displayMode = 'ombre' }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showWeeklyForecast, setShowWeeklyForecast] = useState(false);
  const [forecastIndex, setForecastIndex] = useState(0);
  const [unit, setUnit] = useState(() => {
    return localStorage.getItem('tempUnit') || 'fahrenheit';
  });
  const [activeLocation, setActiveLocation] = useState(() => {
    return localStorage.getItem('weatherLocation') || zipcode || '10001';
  });
  const [editingLocation, setEditingLocation] = useState(false);
  const [locationInput, setLocationInput] = useState('');

  const handleLocationDone = () => {
    const val = locationInput.trim();
    if (!val) return;
    setActiveLocation(val);
    localStorage.setItem('weatherLocation', val);
    setEditingLocation(false);
    setLocationInput('');
    setShowWeeklyForecast(false);
  };

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        let lat, lon, location;

        const isZipcode = /^\d{5}$/.test(activeLocation.trim());

        if (isZipcode) {
          // Zipcode path
          const geoResponse = await fetch(`https://api.zippopotam.us/us/${activeLocation.trim()}`);
          if (!geoResponse.ok) throw new Error('Invalid zipcode');
          const geoData = await geoResponse.json();
          lat = geoData.places[0].latitude;
          lon = geoData.places[0].longitude;
          location = `${geoData.places[0]['place name']}, ${geoData.places[0]['state abbreviation']}`;
        } else {
          // City name path using Open-Meteo geocoding
          const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(activeLocation.trim())}&count=1&language=en&format=json`
          );
          if (!geoResponse.ok) throw new Error('City not found');
          const geoData = await geoResponse.json();
          if (!geoData.results || geoData.results.length === 0) throw new Error('City not found');
          lat = geoData.results[0].latitude;
          lon = geoData.results[0].longitude;
          location = `${geoData.results[0].name}${geoData.results[0].admin1 ? ', ' + geoData.results[0].admin1 : ''}`;
        }

        // Then get weather from open-meteo (free, no API key needed)
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
  }, [activeLocation, unit]);

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
    <div className={`${bgClass} rounded-2xl p-5 border-2 ${displayMode === 'dark' ? 'border-gray-600' : displayMode === 'light' ? 'border-gray-300' : 'border-blue-100'} shadow-lg text-center h-[284px] flex flex-col items-center relative overflow-hidden`}>

      {/* Top buttons row */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
        <button
          onClick={() => { setEditingLocation(e => !e); setLocationInput(activeLocation); setShowWeeklyForecast(false); }}
          className={`${getButtonClass()} h-7 px-3 rounded-lg text-sm font-semibold transition-all shadow-sm cursor-pointer flex items-center justify-center`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-4 h-4">
            <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-2.013 3.5-4.619 3.5-7.327A8.24 8.24 0 0012 3.75a8.24 8.24 0 00-7.79 8.25c0 2.708 1.556 5.314 3.5 7.327a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
          </svg>
        </button>
        <div className="flex gap-2 ml-auto">
          {!editingLocation && (
            <button
              onClick={toggleUnit}
              className={`${getButtonClass()} h-7 px-3 rounded-lg text-sm font-semibold transition-all shadow-sm cursor-pointer flex items-center`}
            >
              {unit === 'fahrenheit' ? '°C' : '°F'}
            </button>
          )}
          {weather && !editingLocation && (
            <button
              onClick={() => setShowWeeklyForecast(v => !v)}
              className={`${getButtonClass()} h-7 px-3 rounded-lg text-sm font-semibold transition-all shadow-sm cursor-pointer flex items-center`}
            >
              {showWeeklyForecast ? 'Today' : 'Week'}
            </button>
          )}
        </div>
      </div>

      <div
        className="transition-opacity duration-200 ease-in-out w-full flex-1 flex flex-col pt-8"
        style={{ opacity: isTransitioning ? 0 : 1 }}
      >
        {editingLocation ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <p className={`text-xs font-bold tracking-wide uppercase ${displayMode === 'dark' ? 'text-purple-300' : displayMode === 'light' ? 'text-gray-500' : 'text-purple-500'}`}>
              Change Location
            </p>

            <input
              autoFocus
              type="text"
              value={locationInput}
              onChange={e => setLocationInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLocationDone()}
              placeholder="City or zipcode…"
              className={`w-56 rounded-xl px-3 py-2 text-sm border-2 text-center focus:outline-none focus:ring-2
                ${displayMode === 'dark'
                  ? 'bg-gray-600 border-gray-500 text-gray-200 placeholder-gray-400 focus:ring-purple-400'
                  : 'bg-white border-purple-200 text-gray-700 placeholder-gray-400 focus:ring-pink-300'}`}
            />
            <div className="flex gap-2">
              <button
                onClick={() => { setEditingLocation(false); setLocationInput(''); }}
                className={`px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer transition-all
                  ${displayMode === 'dark' ? 'bg-gray-600 hover:bg-gray-500 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
              >
                Cancel
              </button>
              <button
                onClick={handleLocationDone}
                className={`${getButtonClass()} px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer transition-all shadow-sm`}
              >
                Confirm
              </button>
            </div>
          </div>
        ) : loading ? (
          <div className="flex-1 flex items-center justify-center">
            <p className={`${displayMode === 'dark' ? 'text-purple-300' : displayMode === 'light' ? 'text-gray-700' : 'text-purple-700'} font-bold`}>Loading weather...</p>
          </div>
        ) : weather ? (
          <>
            {!showWeeklyForecast ? (
              // Today's weather view
              <div className="flex-1 flex flex-col items-center justify-center">
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
              </div>
            ) : (
              // Weekly forecast carousel view
              <div className="flex-1 flex flex-col w-full">
                <p className={`${displayMode === 'dark' ? 'text-purple-300' : displayMode === 'light' ? 'text-gray-800' : 'text-purple-700'} text-base font-bold mb-1`}>7-Day Forecast</p>
                <p className={`${displayMode === 'dark' ? 'text-purple-500' : displayMode === 'light' ? 'text-gray-600' : 'text-purple-500'} text-xs mb-2`}>
                  {weather.location}
                </p>
                <div className="flex items-stretch gap-1 flex-1">
                  <button
                    onClick={() => setForecastIndex(i => Math.max(0, i - 1))}
                    disabled={forecastIndex === 0}
                    className={`text-xs px-1 rounded transition-all cursor-pointer self-center ${forecastIndex === 0 ? 'opacity-20 cursor-default' : 'opacity-80 hover:opacity-100'} ${displayMode === 'dark' ? 'text-purple-300' : 'text-purple-600'}`}
                  >◀</button>
                  <div className="grid grid-cols-3 gap-3 flex-1">
                    {weather.weeklyForecast.slice(forecastIndex, forecastIndex + 3).map((day, index) => {
                      const isToday = forecastIndex + index === 0;
                      return (
                      <div
                        key={forecastIndex + index}
                        className={`flex flex-col items-center justify-center rounded-lg ${
                          displayMode === 'dark' ? 'bg-gray-600/50' : displayMode === 'light' ? 'bg-gray-100' : 'bg-white/50'
                        } ${isToday ? `border-2 ${displayMode === 'dark' ? 'border-purple-400' : displayMode === 'light' ? 'border-blue-400' : 'border-purple-400'}` : ''}`}
                      >
                        <span className={`${displayMode === 'dark' ? 'text-purple-300' : displayMode === 'light' ? 'text-gray-800' : 'text-purple-700'} text-xs font-semibold`}>
                          {day.date.split(',')[0]}
                        </span>
                        <span className={`${displayMode === 'dark' ? 'text-purple-400' : displayMode === 'light' ? 'text-gray-500' : 'text-purple-500'} text-xs`}>
                          {day.date.split(',')[1]?.trim()}
                        </span>
                        <span className="text-xl my-1">{getWeatherEmoji(day.weatherCode)}</span>
                        <span className={`${displayMode === 'dark' ? 'text-purple-400' : displayMode === 'light' ? 'text-gray-700' : 'text-purple-600'} text-xs`}>
                          <span className="text-blue-500">{day.tempMin}°</span>
                          <span className="opacity-40">/</span>
                          <span className="text-red-400">{day.tempMax}°</span>
                        </span>
                      </div>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setForecastIndex(i => Math.min(weather.weeklyForecast.length - 3, i + 1))}
                    disabled={forecastIndex >= weather.weeklyForecast.length - 3}
                    className={`text-xs px-1 rounded transition-all cursor-pointer self-center ${forecastIndex >= weather.weeklyForecast.length - 3 ? 'opacity-20 cursor-default' : 'opacity-80 hover:opacity-100'} ${displayMode === 'dark' ? 'text-purple-300' : 'text-purple-600'}`}
                  >▶</button>
                </div>
              </div>
            )}
          </>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center">
            <p className={`${displayMode === 'dark' ? 'text-purple-400' : displayMode === 'light' ? 'text-gray-600' : 'text-purple-600'} text-sm`}>
              Weather unavailable - check your zipcode
            </p>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className={`${displayMode === 'dark' ? 'text-purple-300' : displayMode === 'light' ? 'text-gray-700' : 'text-purple-700'} font-bold`}>Loading...</p>
          </div>
        )}
      </div>
    </div>
  );
}
