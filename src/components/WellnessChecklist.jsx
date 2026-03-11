import { useState, useEffect } from 'react';

const getToday = () => new Date().toDateString();

const wellnessItems = [
  { id: 'eat', label: 'Have you eaten today?' },
  { id: 'drink', label: 'Did you drink water?' },
  { id: 'smile', label: 'Did you smile today?' }
];

export default function WellnessChecklist({ displayMode = 'ombre' }) {
  const [wellness, setWellness] = useState(() => {
    const today = getToday();
    const saved = localStorage.getItem('wellnessHistory');
    if (saved) {
      const history = JSON.parse(saved);
      if (history[today]) {
        return history[today];
      }
    }
    return { eat: false, drink: false, smile: false };
  });

  useEffect(() => {
    const today = getToday();
    const saved = localStorage.getItem('wellnessHistory');
    const history = saved ? JSON.parse(saved) : {};
    history[today] = wellness;
    localStorage.setItem('wellnessHistory', JSON.stringify(history));
  }, [wellness]);

  const toggleItem = (id) => {
    setWellness(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getBgClass = () => {
    if (displayMode === 'ombre') {
      return 'bg-gradient-to-br from-blue-200 to-purple-200';
    } else if (displayMode === 'dark') {
      return 'bg-gray-700';
    } else if (displayMode === 'light') {
      return 'bg-white';
    } else {
      return 'bg-blue-200';
    }
  };

  const bgClass = getBgClass();

  return (
    <div className={`${bgClass} rounded-2xl p-5 border-2 ${displayMode === 'dark' ? 'border-gray-600' : displayMode === 'light' ? 'border-gray-300' : 'border-blue-100'} shadow-lg h-full`}>
      <h2 className={`${displayMode === 'dark' ? 'text-purple-300' : displayMode === 'light' ? 'text-gray-800' : 'text-purple-700'} text-xl font-bold mb-4 text-center`}>💜 Daily Self-Care</h2>
      <div className="space-y-3">
        {wellnessItems.map(item => (
          <div
            key={item.id}
            className={`bg-white rounded-xl p-3 flex items-center gap-3 border-2 border-purple-100 shadow-sm ${
              wellness[item.id] ? 'opacity-70' : ''
            }`}
          >
            <input
              type="checkbox"
              id={item.id}
              checked={wellness[item.id]}
              onChange={() => toggleItem(item.id)}
              className="w-5 h-5 cursor-pointer accent-pink-500"
            />
            <label
              htmlFor={item.id}
              className="flex-1 cursor-pointer text-gray-800"
            >
              {item.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
