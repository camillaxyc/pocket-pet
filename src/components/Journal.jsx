import { useState, useEffect } from 'react';

const getToday = () => new Date().toDateString();

const getPrompts = (displayMode) => [
  {
    id: 'highlight',
    label: '✨ Highlight of the Day',
    placeholder: 'What made you smile today?',
    gradient: displayMode === 'ombre' ? 'from-yellow-200 to-pink-200' : displayMode === 'dark' ? 'from-gray-600 to-gray-600' : displayMode === 'light' ? 'from-white to-white' : displayMode === 'pastel' ? 'from-yellow-50 to-yellow-50' : 'from-yellow-200 to-yellow-200',
    border: displayMode === 'dark' ? 'border-gray-500' : displayMode === 'light' ? 'border-gray-400' : 'border-yellow-100',
    inputBorder: displayMode === 'dark' ? 'border-gray-500' : displayMode === 'light' ? 'border-gray-400' : 'border-yellow-200',
    focusRing: 'focus:ring-pink-400 focus:border-pink-400'
  },
  {
    id: 'hope',
    label: '🌟 What I Hope Will Happen',
    placeholder: 'Your hopes and dreams...',
    gradient: displayMode === 'ombre' ? 'from-pink-200 to-purple-200' : displayMode === 'dark' ? 'from-gray-600 to-gray-600' : displayMode === 'light' ? 'from-white to-white' : displayMode === 'pastel' ? 'from-pink-50 to-pink-50' : 'from-pink-200 to-pink-200',
    border: displayMode === 'dark' ? 'border-gray-500' : displayMode === 'light' ? 'border-gray-400' : 'border-pink-100',
    inputBorder: displayMode === 'dark' ? 'border-gray-500' : displayMode === 'light' ? 'border-gray-400' : 'border-pink-200',
    focusRing: 'focus:ring-purple-400 focus:border-purple-400'
  },
  {
    id: 'complain',
    label: '😤 Complain of the Day',
    placeholder: 'Let it out! What bothered you today?',
    gradient: displayMode === 'ombre' ? 'from-blue-200 to-purple-300' : displayMode === 'dark' ? 'from-gray-600 to-gray-600' : displayMode === 'light' ? 'from-white to-white' : displayMode === 'pastel' ? 'from-blue-50 to-blue-50' : 'from-blue-200 to-blue-200',
    border: displayMode === 'dark' ? 'border-gray-500' : displayMode === 'light' ? 'border-gray-400' : 'border-blue-100',
    inputBorder: displayMode === 'dark' ? 'border-gray-500' : displayMode === 'light' ? 'border-gray-400' : 'border-blue-200',
    focusRing: 'focus:ring-purple-400 focus:border-purple-400'
  },
  {
    id: 'learned',
    label: '💡 What I Learned Today',
    placeholder: 'New discoveries, lessons, or insights...',
    gradient: displayMode === 'ombre' ? 'from-green-200 to-blue-200' : displayMode === 'dark' ? 'from-gray-600 to-gray-600' : displayMode === 'light' ? 'from-white to-white' : displayMode === 'pastel' ? 'from-green-50 to-green-50' : 'from-green-200 to-green-200',
    border: displayMode === 'dark' ? 'border-gray-500' : displayMode === 'light' ? 'border-gray-400' : 'border-green-100',
    inputBorder: displayMode === 'dark' ? 'border-gray-500' : displayMode === 'light' ? 'border-gray-400' : 'border-green-200',
    focusRing: 'focus:ring-green-400 focus:border-green-400'
  }
];

export default function Journal({ displayMode = 'ombre' }) {
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem('journal');
    return saved ? JSON.parse(saved) : {};
  });

  const [todayEntry, setTodayEntry] = useState({
    general: '',
    highlight: '',
    hope: '',
    complain: '',
    learned: ''
  });

  const [selectedPrompt, setSelectedPrompt] = useState('highlight');

  useEffect(() => {
    // Load today's entry
    const today = getToday();
    const savedEntry = entries[today] || {
      general: '',
      highlight: '',
      hope: '',
      complain: '',
      learned: ''
    };
    setTodayEntry(savedEntry);
  }, [entries]);

  useEffect(() => {
    localStorage.setItem('journal', JSON.stringify(entries));
  }, [entries]);

  const handleSave = () => {
    const today = getToday();
    setEntries({ ...entries, [today]: todayEntry });
  };

  const isToday = () => {
    const today = getToday();
    return true; // Always allow editing on current page
  };

  const handleChange = (field, value) => {
    setTodayEntry({ ...todayEntry, [field]: value });
  };

  const prompts = getPrompts(displayMode);
  const currentPrompt = prompts.find(p => p.id === selectedPrompt);

  return (
    <div className="space-y-4">
      <h2 className={`${displayMode === 'dark' ? 'text-purple-300' : displayMode === 'light' ? 'text-gray-700' : 'text-purple-700'} text-2xl font-bold text-center mb-4`}>📖 Daily Journal</h2>

      <div className={`bg-gradient-to-br ${currentPrompt.gradient} rounded-2xl p-5 border-2 ${currentPrompt.border} shadow-lg`}>
        <select
          value={selectedPrompt}
          onChange={(e) => setSelectedPrompt(e.target.value)}
          className="w-full px-4 py-2 rounded-xl border-2 border-purple-200 text-purple-700 font-bold text-lg mb-3 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 cursor-pointer bg-white"
        >
          {prompts.map(prompt => (
            <option key={prompt.id} value={prompt.id}>
              {prompt.label}
            </option>
          ))}
        </select>

        <textarea
          value={todayEntry[selectedPrompt]}
          onChange={(e) => handleChange(selectedPrompt, e.target.value)}
          onBlur={handleSave}
          placeholder={currentPrompt.placeholder}
          className={`w-full h-16 px-4 py-2 rounded-xl border-2 ${currentPrompt.inputBorder} ${displayMode === 'dark' ? 'text-gray-900 bg-gray-300' : 'text-gray-800 bg-white bg-opacity-70'} focus:outline-none focus:ring-2 ${currentPrompt.focusRing} resize-none`}
        />
      </div>

      <div className={`${displayMode === 'ombre' ? 'bg-gradient-to-br from-purple-200 to-blue-200' : displayMode === 'dark' ? 'bg-gray-700' : displayMode === 'light' ? 'bg-white' : displayMode === 'pastel' ? 'bg-purple-50' : 'bg-purple-200'} rounded-2xl p-5 border-2 ${displayMode === 'dark' ? 'border-gray-600' : displayMode === 'light' ? 'border-gray-300' : 'border-purple-100'} shadow-lg`}>
        <h3 className={`${displayMode === 'dark' ? 'text-purple-300' : displayMode === 'light' ? 'text-gray-700' : 'text-purple-700'} text-lg font-bold mb-3`}>Journal your day</h3>
        <textarea
          value={todayEntry.general}
          onChange={(e) => handleChange('general', e.target.value)}
          onBlur={handleSave}
          placeholder="What's on your mind?"
          className={`w-full h-32 lg:h-48 px-4 py-3 rounded-xl border-2 border-purple-200 ${displayMode === 'dark' ? 'text-gray-900 bg-gray-300' : 'text-gray-800 bg-white bg-opacity-70'} focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 resize-none`}
        />
      </div>

      <p className={`${displayMode === 'dark' ? 'text-purple-400' : displayMode === 'light' ? 'text-gray-600' : 'text-purple-600'} text-sm text-center mt-3`}>
        Your thoughts are automatically saved 💜
      </p>
    </div>
  );
}
