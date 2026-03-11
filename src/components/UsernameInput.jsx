import { useState } from 'react';

export default function UsernameInput({ onSetUsername }) {
  const [name, setName] = useState('');
  const [zipcode, setZipcode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onSetUsername({ name: name.trim(), zipcode: zipcode.trim() });
    }
  };

  return (
    <div className="min-h-screen max-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300 flex items-center justify-center p-3 sm:p-5 overflow-auto">
      <div className="bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 rounded-3xl p-6 sm:p-10 shadow-2xl w-full max-w-[95%] sm:max-w-lg text-center border-4 border-yellow-200 my-auto min-h-[550px] sm:min-h-[400px]">
        <div className="text-6xl mb-4">✨</div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-3">
          Welcome to Pocket Pet!
        </h1>
        <p className="text-purple-600 mb-8 text-lg font-semibold">Hi! What's your name?</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name..."
            className="w-full px-5 py-3 rounded-2xl border-3 border-pink-200 focus:border-purple-400 focus:outline-none focus:ring-4 focus:ring-purple-200 text-center text-lg transition-all"
            maxLength={20}
            autoFocus
          />

          <div>
            <input
              type="text"
              value={zipcode}
              onChange={(e) => setZipcode(e.target.value)}
              placeholder="Zipcode (optional)..."
              className="w-full px-5 py-3 rounded-2xl border-3 border-pink-200 focus:border-purple-400 focus:outline-none focus:ring-4 focus:ring-purple-200 text-center text-lg transition-all"
              maxLength={10}
            />
            <p className="text-purple-600 text-xs mt-2 italic">
              This is for weather forecast, we will not record your information lol
            </p>
          </div>

          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold py-3 px-6 rounded-2xl hover:from-pink-500 hover:to-purple-500 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg cursor-pointer"
          >
            Continue ✨
          </button>
        </form>
      </div>
    </div>
  );
}
