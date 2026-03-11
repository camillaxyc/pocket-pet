import { useMemo, useState } from 'react';

const greetings = {
  cat: [
    "Meow~ I've been waiting for you, {name}!",
    "Purr purr~ Let's have a great day, {name}!",
    "Nya~ Ready to tackle today together, {name}?",
    "Meow! Time for some productivity, {name}!",
    "Hello {name}! Let's be pawsome today!",
    "Purr~ I believe in you today, {name}!"
  ],
  dog: [
    "Woof woof! So happy to see you, {name}!",
    "Bark! Let's have an amazing day, {name}!",
    "Wag wag~ Ready for today's adventures, {name}?",
    "Woof! You're doing great, {name}!",
    "Arf arf! Let's fetch those goals, {name}!",
    "Bark bark~ You've got this, {name}!"
  ],
  bunny: [
    "Hop hop! Welcome back, {name}!",
    "Boing~ Let's make today wonderful, {name}!",
    "Twitch twitch~ Ready to hop into action, {name}?",
    "Hop! You're going to do great today, {name}!",
    "Wiggle wiggle~ Let's be productive, {name}!",
    "Boing boing~ I'm so proud of you, {name}!"
  ]
};

const petEmojis = {
  cat: '🐱',
  dog: '🐶',
  bunny: '🐰'
};

const petNames = {
  cat: 'Your Kitty Companion',
  dog: 'Your Pupper Pal',
  bunny: 'Your Bunny Buddy'
};

const petGradients = {
  cat: 'from-orange-300 to-pink-300',
  dog: 'from-blue-300 to-purple-300',
  bunny: 'from-pink-300 to-purple-300'
};

const petSounds = {
  cat: 'Meow! 🐱',
  dog: 'Woof! 🐕',
  bunny: 'Squeak! 🐰'
};

export default function PetDisplay({ petType, username, onShowRecords, isCollapsed, onToggleCollapse, displayMode = 'ombre', isOnRecordsPage = false }) {
  const [showSound, setShowSound] = useState(false);

  const greeting = useMemo(() => {
    const petGreetings = greetings[petType];
    const randomGreeting = petGreetings[Math.floor(Math.random() * petGreetings.length)];
    return randomGreeting.replace('{name}', username);
  }, [petType, username]);

  const shortGreeting = `Hi ${username}!`;

  const handlePetClick = () => {
    setShowSound(true);
    setTimeout(() => {
      setShowSound(false);
    }, 1500);
  };

  const getBgClass = () => {
    if (displayMode === 'ombre') {
      return `bg-gradient-to-br ${petGradients[petType]}`;
    } else if (displayMode === 'dark') {
      return 'bg-gray-800';
    } else if (displayMode === 'light') {
      // Solid colors based on pet type for light mode
      const petColors = {
        cat: 'bg-orange-400',
        dog: 'bg-blue-400',
        bunny: 'bg-pink-400'
      };
      return petColors[petType];
    } else if (displayMode === 'pastel') {
      return 'bg-pink-50';
    } else {
      return 'bg-pink-200';
    }
  };

  const getButtonClass = (baseColor) => {
    if (displayMode === 'ombre') {
      const gradients = {
        purple: 'bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500',
        yellow: 'bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500'
      };
      return gradients[baseColor] || gradients.purple;
    } else if (displayMode === 'dark') {
      return 'bg-gray-700 hover:bg-gray-600';
    } else if (displayMode === 'light') {
      const lightColors = {
        purple: 'bg-purple-500 hover:bg-purple-600 text-white shadow-md hover:shadow-lg',
        yellow: 'bg-amber-500 hover:bg-amber-600 text-white shadow-md hover:shadow-lg'
      };
      return lightColors[baseColor] || lightColors.purple;
    } else if (displayMode === 'pastel') {
      const pastelColors = {
        purple: 'bg-purple-300 hover:bg-purple-400',
        yellow: 'bg-yellow-300 hover:bg-yellow-400'
      };
      return pastelColors[baseColor] || pastelColors.purple;
    } else {
      const plainColors = {
        purple: 'bg-purple-400 hover:bg-purple-500',
        yellow: 'bg-yellow-400 hover:bg-yellow-500'
      };
      return plainColors[baseColor] || plainColors.purple;
    }
  };

  const bgClass = getBgClass();

  return (
    <div className={`${bgClass} rounded-2xl border-2 border-white shadow-lg relative mb-6 transition-all duration-300 ease-in-out ${isCollapsed ? 'p-0' : 'p-6 text-center'}`}>
      {/* Top Right Buttons - Records and Expand/Collapse */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        {/* Expand/Collapse Button (desktop only) */}
        {onToggleCollapse && (
          <button
            onClick={() => onToggleCollapse(!isCollapsed)}
            className={`hidden sm:flex ${displayMode === 'light' ? 'bg-white hover:bg-gray-100 text-black' : getButtonClass('purple') + ' text-white'} px-4 py-2 rounded-2xl transition-all shadow-lg cursor-pointer font-bold items-center justify-center text-sm`}
          >
            <span>{isCollapsed ? '▼' : '▲'}</span>
          </button>
        )}

        {/* Records/Home Button */}
        {onShowRecords && (
          <button
            onClick={onShowRecords}
            className={`${displayMode === 'light' ? 'bg-white hover:bg-gray-100 text-black' : getButtonClass('yellow') + ' text-white'} px-3 py-2 rounded-2xl transition-all shadow-lg cursor-pointer font-bold flex items-center text-sm min-w-[140px] whitespace-nowrap`}
          >
            <span className="text-lg mr-3">{isOnRecordsPage ? '🏠' : '📖'}</span>
            <span>{isOnRecordsPage ? 'Home' : 'Your Records'}</span>
          </button>
        )}
      </div>

      {/* Desktop Collapsed View - hidden sm:flex */}
      {isCollapsed && (
        <div className="hidden sm:flex items-center gap-3 p-4 pr-40 transition-opacity duration-300 ease-in-out">
          <div className="relative">
            <div
              className="w-12 h-12 bg-white bg-opacity-50 rounded-full flex items-center justify-center text-2xl border-2 border-white flex-shrink-0 cursor-pointer transition-transform hover:scale-110"
              onClick={handlePetClick}
            >
              {petEmojis[petType]}
            </div>
            {showSound && (
              <div className="absolute -right-16 top-1/2 -translate-y-1/2 bg-white px-2 py-1 rounded-lg shadow-lg border-2 border-purple-200 text-purple-700 font-bold text-xs whitespace-nowrap animate-[fadeOut_1.5s_ease-in-out]">
                {petSounds[petType]}
              </div>
            )}
          </div>
          <div className={`${displayMode === 'dark' ? 'text-gray-300' : displayMode === 'light' ? 'text-white' : 'text-purple-700'} text-sm font-bold truncate`}>{shortGreeting}</div>
        </div>
      )}

      {/* Mobile: Always show full display */}
      {isCollapsed && (
        <div className="sm:hidden p-6 text-center">
          <div className="relative inline-block">
            <div
              className="w-24 h-24 bg-white bg-opacity-50 rounded-full mx-auto mb-4 flex items-center justify-center text-5xl border-4 border-white cursor-pointer transition-transform hover:scale-110"
              onClick={handlePetClick}
            >
              {petEmojis[petType]}
            </div>
            {showSound && (
              <div className="absolute -right-16 top-1/2 -translate-y-1/2 bg-white px-3 py-1 rounded-lg shadow-lg border-2 border-purple-200 text-purple-700 font-bold text-sm whitespace-nowrap animate-[bounce_0.5s_ease-in-out_1]">
                {petSounds[petType]}
              </div>
            )}
          </div>
          <div className={`${displayMode === 'dark' ? 'text-gray-300' : displayMode === 'light' ? 'text-white' : 'text-purple-700'} text-xl font-bold mb-2`}>{greeting}</div>
          <div className={`${displayMode === 'dark' ? 'text-gray-200' : displayMode === 'light' ? 'text-white' : 'text-gray-800'} text-lg font-semibold`}>{petNames[petType]}</div>
        </div>
      )}

      {/* Desktop Expanded View */}
      {!isCollapsed && (
        <div className="transition-opacity duration-300 ease-in-out">
          <div className="relative inline-block">
            <div
              className="w-24 h-24 bg-white bg-opacity-50 rounded-full mx-auto mb-4 flex items-center justify-center text-5xl border-4 border-white cursor-pointer transition-transform hover:scale-110"
              onClick={handlePetClick}
            >
              {petEmojis[petType]}
            </div>
            {showSound && (
              <div className="absolute -right-16 top-1/2 -translate-y-1/2 bg-white px-3 py-1 rounded-lg shadow-lg border-2 border-purple-200 text-purple-700 font-bold text-sm whitespace-nowrap animate-[bounce_0.5s_ease-in-out_1]">
                {petSounds[petType]}
              </div>
            )}
          </div>
          <div className={`${displayMode === 'dark' ? 'text-gray-300' : displayMode === 'light' ? 'text-white' : 'text-purple-700'} text-xl font-bold mb-2`}>{greeting}</div>
          <div className={`${displayMode === 'dark' ? 'text-gray-200' : displayMode === 'light' ? 'text-white' : 'text-gray-800'} text-lg font-semibold`}>{petNames[petType]}</div>
        </div>
      )}
    </div>
  );
}
