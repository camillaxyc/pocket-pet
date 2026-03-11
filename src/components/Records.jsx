import { useState, useEffect } from 'react';

const getToday = () => new Date().toDateString();

export default function Records({ displayMode = 'ombre', petType = 'cat' }) {
  const [records, setRecords] = useState([]);
  const [expandedEntries, setExpandedEntries] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const toggleEntry = (date) => {
    setExpandedEntries(prev => ({
      ...prev,
      [date]: !prev[date]
    }));
  };

  useEffect(() => {
    // Gather all data from localStorage
    const journal = JSON.parse(localStorage.getItem('journal') || '{}');
    const wellnessHistory = JSON.parse(localStorage.getItem('wellnessHistory') || '{}');
    const weatherCache = JSON.parse(localStorage.getItem('weatherCache') || '{}');
    const todosHistory = JSON.parse(localStorage.getItem('todosHistory') || '{}');

    const today = getToday();

    // Combine all dates from different sources
    const allDates = new Set([
      ...Object.keys(journal),
      ...Object.keys(wellnessHistory),
      ...Object.keys(weatherCache),
      ...Object.keys(todosHistory)
    ]);

    // Create records for each past date
    const recordsArray = Array.from(allDates)
      .filter(date => date !== today)
      .map(date => {
        const journalEntry = journal[date] || {};
        const wellness = wellnessHistory[date] || null;
        const weather = weatherCache[date] || null;
        const todos = todosHistory[date] || null;

        return {
          date,
          journal: journalEntry,
          wellness,
          weather,
          todos
        };
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date)); // Most recent first

    setRecords(recordsArray);
  }, []);

  const confirmDelete = (dateToDelete) => {
    // Remove from journal
    const journal = JSON.parse(localStorage.getItem('journal') || '{}');
    delete journal[dateToDelete];
    localStorage.setItem('journal', JSON.stringify(journal));

    // Remove from wellness history
    const wellnessHistory = JSON.parse(localStorage.getItem('wellnessHistory') || '{}');
    delete wellnessHistory[dateToDelete];
    localStorage.setItem('wellnessHistory', JSON.stringify(wellnessHistory));

    // Remove from weather cache
    const weatherCache = JSON.parse(localStorage.getItem('weatherCache') || '{}');
    delete weatherCache[dateToDelete];
    localStorage.setItem('weatherCache', JSON.stringify(weatherCache));

    // Remove from todos history
    const todosHistory = JSON.parse(localStorage.getItem('todosHistory') || '{}');
    delete todosHistory[dateToDelete];
    localStorage.setItem('todosHistory', JSON.stringify(todosHistory));

    // Update records state
    setRecords(records.filter(r => r.date !== dateToDelete));
    setDeleteConfirm(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getButtonClass = (baseColor) => {
    if (displayMode === 'ombre') {
      const gradients = {
        pink: 'bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white',
        blue: 'bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500 text-white',
        gray: 'bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white',
        red: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white'
      };
      return gradients[baseColor] || gradients.pink;
    } else if (displayMode === 'dark') {
      // Dark mode: Open Entry (blue) = purple-300, Delete (pink) = light grey with dark text
      if (baseColor === 'blue') {
        return 'bg-purple-300 hover:bg-purple-400 text-gray-800';
      } else if (baseColor === 'pink') {
        return 'bg-gray-300 hover:bg-gray-400 text-gray-800';
      }
      return 'bg-gray-600 hover:bg-gray-500 text-white';
    } else if (displayMode === 'light') {
      // Light mode: Open Entry (blue) = pet-specific color, Delete (pink) = dark grey with white text
      if (baseColor === 'blue') {
        const petColors = {
          cat: 'bg-orange-400 hover:bg-orange-500 text-white',
          dog: 'bg-blue-400 hover:bg-blue-500 text-white',
          bunny: 'bg-pink-400 hover:bg-pink-500 text-white'
        };
        return petColors[petType] || petColors.cat;
      } else if (baseColor === 'pink') {
        return 'bg-gray-700 hover:bg-gray-800 text-white';
      }
      return 'bg-gray-300 hover:bg-gray-400 text-gray-800';
    } else if (displayMode === 'pastel') {
      const pastelColors = {
        pink: 'bg-pink-300 hover:bg-pink-400 text-white',
        blue: 'bg-blue-300 hover:bg-blue-400 text-white',
        gray: 'bg-gray-300 hover:bg-gray-400 text-white',
        red: 'bg-red-400 hover:bg-red-500 text-white'
      };
      return pastelColors[baseColor] || pastelColors.pink;
    } else {
      const plainColors = {
        pink: 'bg-pink-400 hover:bg-pink-500 text-white',
        blue: 'bg-blue-400 hover:bg-blue-500 text-white',
        gray: 'bg-gray-400 hover:bg-gray-500 text-white',
        red: 'bg-red-500 hover:bg-red-600 text-white'
      };
      return plainColors[baseColor] || plainColors.pink;
    }
  };

  return (
    <div className="space-y-4">
      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-gray-900/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md mx-4 border-4 border-red-300 shadow-2xl">
            <div className="text-center mb-4">
              <div className="text-5xl mb-3">⚠️</div>
              <h3 className="text-red-600 text-xl font-bold mb-2">Delete Journal Entry?</h3>
              <p className="text-gray-700 mb-1">
                If you delete this journal entry, it is <span className="font-bold text-red-600">permanent</span> and it won't come back.
              </p>
              <p className="text-gray-600 text-sm mt-2">
                Entry: {formatDate(deleteConfirm)}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className={`flex-1 ${getButtonClass('gray')} text-white px-4 py-2 rounded-xl font-bold transition-all shadow-md cursor-pointer`}
              >
                Nevermind
              </button>
              <button
                onClick={() => confirmDelete(deleteConfirm)}
                className={`flex-1 ${getButtonClass('red')} text-white px-4 py-2 rounded-xl font-bold transition-all shadow-md cursor-pointer`}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h2 className={`${displayMode === 'dark' ? 'text-purple-300' : displayMode === 'light' ? 'text-gray-700' : 'text-purple-700'} text-2xl font-bold`}>📖 Your Records</h2>
      </div>

      {records.length === 0 ? (
        <div className={`${displayMode === 'ombre' ? 'bg-gradient-to-br from-purple-200 to-blue-200' : displayMode === 'dark' ? 'bg-gray-700' : displayMode === 'light' ? 'bg-gray-200' : displayMode === 'pastel' ? 'bg-purple-50' : 'bg-purple-200'} rounded-2xl p-8 border-2 ${displayMode === 'dark' ? 'border-gray-600' : displayMode === 'light' ? 'border-gray-400' : 'border-purple-100'} shadow-lg text-center`}>
          <p className={`${displayMode === 'dark' ? 'text-purple-300' : displayMode === 'light' ? 'text-gray-700' : 'text-purple-700'} text-lg`}>No past records yet. Keep journaling to build your history!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {records.map(record => {
            const isExpanded = expandedEntries[record.date];
            const shouldCollapse = records.length > 2;

            return (
              <div
                key={record.date}
                className={`${displayMode === 'ombre' ? 'bg-gradient-to-br from-pink-100 to-purple-100' : displayMode === 'dark' ? 'bg-gray-700' : displayMode === 'light' ? 'bg-gray-50' : displayMode === 'pastel' ? 'bg-pink-50' : 'bg-pink-100'} rounded-2xl p-5 border-2 ${displayMode === 'dark' ? 'border-gray-600' : displayMode === 'light' ? 'border-gray-400' : 'border-pink-200'} shadow-lg`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`${displayMode === 'dark' ? 'text-purple-300' : displayMode === 'light' ? 'text-gray-700' : 'text-purple-700'} text-xl font-bold`}>{formatDate(record.date)}</h3>
                  <div className="flex gap-2">
                    {shouldCollapse && (
                      <button
                        onClick={() => toggleEntry(record.date)}
                        className={`${getButtonClass('blue')} px-3 py-1 rounded-lg text-sm transition-all shadow-sm cursor-pointer`}
                      >
                        {isExpanded ? 'Close Entry' : 'Open Entry'}
                      </button>
                    )}
                    <button
                      onClick={() => setDeleteConfirm(record.date)}
                      className={`${getButtonClass('pink')} px-3 py-1 rounded-lg text-sm transition-all shadow-sm cursor-pointer`}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Show content only if expanded or if there are 2 or fewer records */}
                {(!shouldCollapse || isExpanded) && (
                  <>
                    {/* Weather Info */}
                    {record.weather && (
                <div className={`bg-white rounded-xl p-3 mb-3 border-2 ${displayMode === 'dark' ? 'border-gray-500' : displayMode === 'light' ? 'border-gray-400' : 'border-purple-100'}`}>
                  <p className={`${displayMode === 'dark' ? 'text-purple-300' : displayMode === 'light' ? 'text-gray-700' : 'text-purple-600'} font-bold text-sm mb-1`}>Weather</p>
                  <p className="text-gray-800">
                    {record.weather.emoji} {record.weather.tempMin && record.weather.tempMax
                      ? `${record.weather.tempMin}°F - ${record.weather.tempMax}°F`
                      : `${record.weather.temp}°F`} - {record.weather.condition}
                    {record.weather.location && ` in ${record.weather.location}`}
                  </p>
                </div>
              )}

              {/* Wellness Info */}
              {record.wellness && (
                <div className={`bg-white rounded-xl p-3 mb-3 border-2 ${displayMode === 'dark' ? 'border-gray-500' : displayMode === 'light' ? 'border-gray-400' : 'border-purple-100'}`}>
                  <p className={`${displayMode === 'dark' ? 'text-purple-300' : displayMode === 'light' ? 'text-gray-700' : 'text-purple-600'} font-bold text-sm mb-2`}>Daily Self-Care</p>
                  <div className="text-gray-800 text-sm space-y-1">
                    <p>{record.wellness.eat ? '✓' : '✗'} Ate today</p>
                    <p>{record.wellness.drink ? '✓' : '✗'} Drank water</p>
                    <p>{record.wellness.smile ? '✓' : '✗'} Smiled today</p>
                  </div>
                </div>
              )}

              {/* Todos Info */}
              {record.todos && record.todos.length > 0 && (() => {
                const completedTasks = record.todos.filter(todo => todo.completed);
                const notCompletedTasks = record.todos.filter(todo => !todo.completed);

                return (
                  <div className={`bg-white rounded-xl p-3 mb-3 border-2 ${displayMode === 'dark' ? 'border-gray-500' : displayMode === 'light' ? 'border-gray-400' : 'border-purple-100'}`}>
                    <p className={`${displayMode === 'dark' ? 'text-purple-300' : displayMode === 'light' ? 'text-gray-700' : 'text-purple-600'} font-bold text-sm mb-2`}>Tasks</p>

                    {completedTasks.length > 0 && (
                      <div className="mb-3">
                        <p className={`${displayMode === 'dark' ? 'text-green-400' : 'text-green-600'} font-semibold text-xs mb-1`}>✓ Completed</p>
                        <ul className="space-y-1">
                          {completedTasks.map(todo => (
                            <li key={todo.id} className="text-gray-800 text-sm">
                              {todo.text}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {notCompletedTasks.length > 0 && (
                      <div>
                        <p className={`${displayMode === 'dark' ? 'text-gray-400' : 'text-gray-600'} font-semibold text-xs mb-1`}>Not Yet Completed</p>
                        <ul className="space-y-1">
                          {notCompletedTasks.map(todo => (
                            <li key={todo.id} className="text-gray-800 text-sm">
                              {todo.text}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Journal Entries */}
              {record.journal && (
                <div className="space-y-2">
                  {record.journal.highlight && (
                    <div className={`${displayMode === 'ombre' ? 'bg-gradient-to-br from-yellow-200 to-pink-200' : displayMode === 'dark' ? 'bg-gray-600' : displayMode === 'light' ? 'bg-gray-100' : displayMode === 'pastel' ? 'bg-yellow-50' : 'bg-yellow-200'} rounded-xl p-3 border-2 ${displayMode === 'dark' ? 'border-gray-500' : displayMode === 'light' ? 'border-gray-400' : 'border-yellow-100'}`}>
                      <p className={`${displayMode === 'dark' ? 'text-purple-300' : displayMode === 'light' ? 'text-gray-700' : 'text-purple-700'} font-bold text-sm mb-1`}>✨ Highlight of the Day</p>
                      <p className={`${displayMode === 'dark' ? 'text-gray-200' : 'text-gray-800'} text-sm`}>{record.journal.highlight}</p>
                    </div>
                  )}
                  {record.journal.hope && (
                    <div className={`${displayMode === 'ombre' ? 'bg-gradient-to-br from-pink-200 to-purple-200' : displayMode === 'dark' ? 'bg-gray-600' : displayMode === 'light' ? 'bg-gray-100' : displayMode === 'pastel' ? 'bg-pink-50' : 'bg-pink-200'} rounded-xl p-3 border-2 ${displayMode === 'dark' ? 'border-gray-500' : displayMode === 'light' ? 'border-gray-400' : 'border-pink-100'}`}>
                      <p className={`${displayMode === 'dark' ? 'text-purple-300' : displayMode === 'light' ? 'text-gray-700' : 'text-purple-700'} font-bold text-sm mb-1`}>🌟 What I Hoped Would Happen</p>
                      <p className={`${displayMode === 'dark' ? 'text-gray-200' : 'text-gray-800'} text-sm`}>{record.journal.hope}</p>
                    </div>
                  )}
                  {record.journal.complain && (
                    <div className={`${displayMode === 'ombre' ? 'bg-gradient-to-br from-blue-200 to-purple-300' : displayMode === 'dark' ? 'bg-gray-600' : displayMode === 'light' ? 'bg-gray-100' : displayMode === 'pastel' ? 'bg-blue-50' : 'bg-blue-200'} rounded-xl p-3 border-2 ${displayMode === 'dark' ? 'border-gray-500' : displayMode === 'light' ? 'border-gray-400' : 'border-blue-100'}`}>
                      <p className={`${displayMode === 'dark' ? 'text-purple-300' : displayMode === 'light' ? 'text-gray-700' : 'text-purple-700'} font-bold text-sm mb-1`}>😤 Complain of the Day</p>
                      <p className={`${displayMode === 'dark' ? 'text-gray-200' : 'text-gray-800'} text-sm`}>{record.journal.complain}</p>
                    </div>
                  )}
                  {record.journal.learned && (
                    <div className={`${displayMode === 'ombre' ? 'bg-gradient-to-br from-green-200 to-blue-200' : displayMode === 'dark' ? 'bg-gray-600' : displayMode === 'light' ? 'bg-gray-100' : displayMode === 'pastel' ? 'bg-green-50' : 'bg-green-200'} rounded-xl p-3 border-2 ${displayMode === 'dark' ? 'border-gray-500' : displayMode === 'light' ? 'border-gray-400' : 'border-green-100'}`}>
                      <p className={`${displayMode === 'dark' ? 'text-purple-300' : displayMode === 'light' ? 'text-gray-700' : 'text-purple-700'} font-bold text-sm mb-1`}>💡 What I Learned</p>
                      <p className={`${displayMode === 'dark' ? 'text-gray-200' : 'text-gray-800'} text-sm`}>{record.journal.learned}</p>
                    </div>
                  )}
                  {record.journal.general && (
                    <div className={`${displayMode === 'ombre' ? 'bg-gradient-to-br from-purple-200 to-blue-200' : displayMode === 'dark' ? 'bg-gray-600' : displayMode === 'light' ? 'bg-gray-100' : displayMode === 'pastel' ? 'bg-purple-50' : 'bg-purple-200'} rounded-xl p-3 border-2 ${displayMode === 'dark' ? 'border-gray-500' : displayMode === 'light' ? 'border-gray-400' : 'border-purple-100'}`}>
                      <p className={`${displayMode === 'dark' ? 'text-purple-300' : displayMode === 'light' ? 'text-gray-700' : 'text-purple-700'} font-bold text-sm mb-1`}>Journal Entry</p>
                      <p className={`${displayMode === 'dark' ? 'text-gray-200' : 'text-gray-800'} text-sm whitespace-pre-wrap`}>{record.journal.general}</p>
                    </div>
                  )}
                </div>
              )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
