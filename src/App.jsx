import { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import UsernameInput from './components/UsernameInput';
import PetSelection from './components/PetSelection';
import PetDisplay from './components/PetDisplay';
import WellnessChecklist from './components/WellnessChecklist';
import PositiveQuote from './components/WeatherWidget';
import Quote from './components/Quote';
import TodoList from './components/TodoList';
import Journal from './components/Journal';
import Records from './components/Records';
import Footer from './components/Footer';

function App() {
  const [userInfo, setUserInfo] = useLocalStorage('pocketPetUserInfo', null);
  const [selectedPet, setSelectedPet] = useLocalStorage('pocketPet', null);
  const [isPetDisplayCollapsed, setIsPetDisplayCollapsed] = useLocalStorage('pocketPetDisplayCollapsed', false);
  const [displayMode, setDisplayMode] = useLocalStorage('displayMode', 'ombre'); // 'ombre', 'plain', 'dark', 'light'
  const [currentPage, setCurrentPage] = useState(0);
  const [showRecords, setShowRecords] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Helper to determine button styling based on display mode
  const getButtonClass = (baseColor) => {
    if (displayMode === 'ombre') {
      const gradients = {
        pink: 'bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500',
        purple: 'bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500',
        blue: 'bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500',
        yellow: 'bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500',
        green: 'bg-gradient-to-r from-green-400 to-blue-400 hover:from-green-500 hover:to-blue-500',
        gray: 'bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600',
        purplePink: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
      };
      return gradients[baseColor] || gradients.pink;
    } else if (displayMode === 'dark') {
      // Dark mode - all buttons are shades of gray
      return 'bg-gray-700 hover:bg-gray-600';
    } else if (displayMode === 'light') {
      // Light mode - navigation buttons same as dark mode, others colorful
      if (baseColor === 'pink') {
        return 'bg-gray-700 hover:bg-gray-600';
      }
      const lightColors = {
        purple: 'bg-purple-500 hover:bg-purple-600 text-white shadow-md hover:shadow-lg',
        blue: 'bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg',
        yellow: 'bg-amber-500 hover:bg-amber-600 text-white shadow-md hover:shadow-lg',
        green: 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md hover:shadow-lg',
        gray: 'bg-slate-500 hover:bg-slate-600 text-white shadow-md hover:shadow-lg',
        purplePink: 'bg-fuchsia-500 hover:bg-fuchsia-600 text-white shadow-md hover:shadow-lg'
      };
      return lightColors[baseColor] || 'bg-gray-700 hover:bg-gray-600';
    } else if (displayMode === 'pastel') {
      const pastelColors = {
        pink: 'bg-pink-300 hover:bg-pink-400',
        purple: 'bg-purple-300 hover:bg-purple-400',
        blue: 'bg-blue-300 hover:bg-blue-400',
        yellow: 'bg-yellow-300 hover:bg-yellow-400',
        green: 'bg-green-300 hover:bg-green-400',
        gray: 'bg-gray-300 hover:bg-gray-400',
        purplePink: 'bg-purple-300 hover:bg-purple-400'
      };
      return pastelColors[baseColor] || pastelColors.pink;
    } else { // plain
      const plainColors = {
        pink: 'bg-pink-400 hover:bg-pink-500',
        purple: 'bg-purple-400 hover:bg-purple-500',
        blue: 'bg-blue-400 hover:bg-blue-500',
        yellow: 'bg-yellow-400 hover:bg-yellow-500',
        green: 'bg-green-400 hover:bg-green-500',
        gray: 'bg-gray-400 hover:bg-gray-500',
        purplePink: 'bg-purple-500 hover:bg-purple-600'
      };
      return plainColors[baseColor] || plainColors.pink;
    }
  };

  // Get main background class based on display mode
  const getMainBgClass = () => {
    if (displayMode === 'ombre') {
      return 'bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300';
    } else if (displayMode === 'dark') {
      return 'bg-gray-900';
    } else if (displayMode === 'light') {
      return 'bg-gray-50';
    } else if (displayMode === 'pastel') {
      return 'bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50';
    } else {
      return 'bg-purple-200';
    }
  };

  if (!userInfo) {
    return <UsernameInput onSetUsername={setUserInfo} />;
  }

  const username = userInfo.name || userInfo;
  const zipcode = userInfo.zipcode || '';

  if (!selectedPet) {
    return <PetSelection onSelectPet={setSelectedPet} username={username} />;
  }

  if (showRecords) {
    return (
      <div className={`min-h-screen ${getMainBgClass()} flex items-center justify-center p-3 sm:p-5`}>
        <div className={`${displayMode === 'dark' ? 'bg-gray-800 border-gray-700' : displayMode === 'light' ? 'bg-white border-gray-300' : 'bg-white border-pink-200'} rounded-3xl p-5 sm:p-8 shadow-2xl w-full max-w-[95%] sm:max-w-[90%] lg:max-w-[75%] border-4`}>
          <PetDisplay petType={selectedPet} username={username} onShowRecords={() => setShowRecords(false)} isCollapsed={isPetDisplayCollapsed} onToggleCollapse={setIsPetDisplayCollapsed} displayMode={displayMode} isOnRecordsPage={true} />
          <Records displayMode={displayMode} petType={selectedPet} />
          <Footer displayMode={displayMode} userInfo={userInfo} setUserInfo={setUserInfo} setSelectedPet={setSelectedPet} setDisplayMode={setDisplayMode} getButtonClass={getButtonClass} />
        </div>
      </div>
    );
  }

  const pages = [
    {
      component: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            <WellnessChecklist displayMode={displayMode} />
            <PositiveQuote zipcode={zipcode} displayMode={displayMode} />
          </div>
          <Quote displayMode={displayMode} />
        </div>
      ),
      name: 'Daily Overview'
    },
    { component: <TodoList username={username} petType={selectedPet} displayMode={displayMode} />, name: 'Todo List' },
    { component: <Journal displayMode={displayMode} />, name: 'Journal' }
  ];

  const nextPage = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentPage((prev) => (prev + 1) % pages.length);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 200);
  };

  const prevPage = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentPage((prev) => (prev - 1 + pages.length) % pages.length);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 200);
  };

  return (
    <div className={`min-h-screen ${getMainBgClass()} flex items-center justify-center p-3 sm:p-5`}>
      <div className={`${displayMode === 'dark' ? 'bg-gray-800 border-gray-700' : displayMode === 'light' ? 'bg-white border-gray-300' : 'bg-white border-pink-200'} rounded-3xl p-5 sm:p-8 shadow-2xl w-full max-w-[95%] sm:max-w-[90%] lg:max-w-[75%] border-4`}>
        <PetDisplay petType={selectedPet} username={username} onShowRecords={() => setShowRecords(true)} isCollapsed={isPetDisplayCollapsed} onToggleCollapse={setIsPetDisplayCollapsed} displayMode={displayMode} />

        {/* Pagination Controls */}
        <div className="mb-6">
          {/* Mobile: Buttons on top */}
          <div className="flex items-center justify-center gap-4 mb-4 sm:hidden">
            <button
              onClick={prevPage}
              className={`${getButtonClass('pink')} text-white px-6 py-2 rounded-2xl transition-all shadow-lg cursor-pointer font-bold`}
            >
              ◀
            </button>
            <span className={`${displayMode === 'dark' ? 'text-purple-300' : displayMode === 'light' ? 'text-gray-800' : 'text-purple-700'} font-semibold`}>{pages[currentPage].name}</span>
            <button
              onClick={nextPage}
              className={`${getButtonClass('pink')} text-white px-6 py-2 rounded-2xl transition-all shadow-lg cursor-pointer font-bold`}
            >
              ▶
            </button>
          </div>

          {/* Desktop: Buttons on sides */}
          <div className="hidden sm:flex items-center justify-center gap-4">
            <button
              onClick={prevPage}
              className={`${getButtonClass('pink')} text-white px-4 py-2 rounded-2xl transition-all shadow-lg cursor-pointer font-bold`}
            >
              ◀
            </button>

            <div className="flex-1 transition-opacity duration-200 ease-in-out" style={{ opacity: isTransitioning ? 0 : 1 }}>
              {pages[currentPage].component}
            </div>

            <button
              onClick={nextPage}
              className={`${getButtonClass('pink')} text-white px-4 py-2 rounded-2xl transition-all shadow-lg cursor-pointer font-bold`}
            >
              ▶
            </button>
          </div>

          {/* Mobile: Content below buttons */}
          <div className="sm:hidden transition-opacity duration-200 ease-in-out" style={{ opacity: isTransitioning ? 0 : 1 }}>
            {pages[currentPage].component}
          </div>
        </div>

        <Footer displayMode={displayMode} userInfo={userInfo} setUserInfo={setUserInfo} setSelectedPet={setSelectedPet} setDisplayMode={setDisplayMode} getButtonClass={getButtonClass} />
      </div>
    </div>
  );
}

export default App;
