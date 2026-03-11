import { useState } from 'react';

export default function PetSelection({ onSelectPet, username }) {
  const pets = [
    { type: 'cat', emoji: '🐱', name: 'Cat', gradient: 'from-orange-300 to-pink-400' },
    { type: 'dog', emoji: '🐶', name: 'Dog', gradient: 'from-blue-300 to-purple-400' },
    { type: 'bunny', emoji: '🐰', name: 'Bunny', gradient: 'from-pink-300 to-purple-400' },
  ];

  const [currentPetIndex, setCurrentPetIndex] = useState(0);

  const nextPet = () => {
    setCurrentPetIndex((prev) => (prev + 1) % pets.length);
  };

  const prevPet = () => {
    setCurrentPetIndex((prev) => (prev - 1 + pets.length) % pets.length);
  };

  return (
    <div className="min-h-screen max-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300 flex items-center justify-center p-3 sm:p-5 overflow-auto">
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-2xl w-full max-w-[95%] sm:max-w-lg text-center border-4 border-pink-200 my-auto min-h-[550px] sm:min-h-[400px] flex flex-col justify-center">
        <div className="text-5xl mb-4">🌟</div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-2">
          Hi {username}!
        </h1>
        <p className="text-gray-600 mb-8 text-lg">Choose your daily companion:</p>

        {/* Desktop/Tablet: Show all 3 pets in a row */}
        <div className="hidden sm:flex gap-5 justify-center">
          {pets.map((pet) => (
            <button
              key={pet.type}
              onClick={() => onSelectPet(pet.type)}
              className={`bg-gradient-to-br ${pet.gradient} rounded-2xl p-6 sm:p-8 flex-1 max-w-[140px] transition-transform hover:scale-110 hover:shadow-xl border-3 border-white shadow-lg cursor-pointer`}
            >
              <span className="text-5xl block mb-3">{pet.emoji}</span>
              <span className="text-white font-bold text-lg drop-shadow-md">{pet.name}</span>
            </button>
          ))}
        </div>

        {/* Mobile: Show one pet with navigation */}
        <div className="sm:hidden flex items-center justify-center gap-4">
          <button
            onClick={prevPet}
            className="bg-gradient-to-r from-pink-400 to-purple-400 text-white px-4 py-2 rounded-2xl hover:from-pink-500 hover:to-purple-500 transition-all shadow-lg cursor-pointer text-2xl font-bold"
          >
            &lt;
          </button>

          <button
            onClick={() => onSelectPet(pets[currentPetIndex].type)}
            className={`bg-gradient-to-br ${pets[currentPetIndex].gradient} rounded-2xl p-8 w-40 h-44 transition-all hover:scale-110 hover:shadow-xl border-3 border-white shadow-lg cursor-pointer`}
          >
            <span className="text-6xl block mb-3">{pets[currentPetIndex].emoji}</span>
            <span className="text-white font-bold text-xl drop-shadow-md">{pets[currentPetIndex].name}</span>
          </button>

          <button
            onClick={nextPet}
            className="bg-gradient-to-r from-pink-400 to-purple-400 text-white px-4 py-2 rounded-2xl hover:from-pink-500 hover:to-purple-500 transition-all shadow-lg cursor-pointer text-2xl font-bold"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
