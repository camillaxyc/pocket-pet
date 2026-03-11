import { useState } from 'react';

export default function Footer({ displayMode = 'ombre', userInfo, setUserInfo, setSelectedPet, setDisplayMode, getButtonClass }) {
  const [showSettings, setShowSettings] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [settingsView, setSettingsView] = useState('main');
  const [tempName, setTempName] = useState('');
  const [tempZipcode, setTempZipcode] = useState('');

  const openSettings = () => {
    setSettingsView('main');
    setShowSettings(true);
  };

  const closeSettings = () => {
    setShowSettings(false);
    setSettingsView('main');
  };

  const openNameEdit = () => {
    const currentName = userInfo.name || userInfo;
    setTempName(currentName);
    setSettingsView('name');
  };

  const openZipcodeEdit = () => {
    const currentZipcode = userInfo.zipcode || '';
    setTempZipcode(currentZipcode);
    setSettingsView('zipcode');
  };

  const saveName = () => {
    if (tempName.trim()) {
      const currentZipcode = userInfo.zipcode || '';
      setUserInfo({ name: tempName.trim(), zipcode: currentZipcode });
      setSettingsView('main');
    }
  };

  const saveZipcode = () => {
    const currentName = userInfo.name || userInfo;
    setUserInfo({ name: currentName, zipcode: tempZipcode.trim() });
    setSettingsView('main');
  };

  const openDisplayEdit = () => {
    setSettingsView('display');
  };

  const selectDisplayMode = (mode) => {
    setDisplayMode(mode);
    setSettingsView('main');
  };

  const resetPet = () => {
    setSelectedPet(null);
    closeSettings();
  };

  return (
    <>
      <div className="mt-5 text-center flex items-center justify-center gap-6">
        <button
          onClick={() => setShowAbout(true)}
          className={`${displayMode === 'light' ? 'text-slate-700 hover:text-slate-900' : 'text-purple-500 hover:text-purple-700'} text-lg font-semibold transition-colors cursor-pointer inline-flex items-center gap-2`}
        >
          <span className="text-2xl">ℹ️</span>
          <span>About</span>
        </button>
        <button
          onClick={openSettings}
          className={`${displayMode === 'light' ? 'text-slate-700 hover:text-slate-900' : 'text-purple-500 hover:text-purple-700'} text-lg font-semibold transition-colors cursor-pointer inline-flex items-center gap-2`}
        >
          <span className="text-2xl">⚙️</span>
          <span>Settings</span>
        </button>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-gray-900/20 flex items-center justify-center z-50" onClick={closeSettings}>
          <div className="bg-white rounded-2xl p-6 w-80 mx-4 border-4 border-purple-300 shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button
              onClick={closeSettings}
              className="absolute top-3 right-3 border-2 border-gray-400 hover:border-gray-600 text-gray-600 hover:text-gray-800 w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-xl transition-all cursor-pointer bg-white"
            >
              ✕
            </button>

            <h2 className="text-purple-700 text-2xl font-bold mb-6 text-center">Settings</h2>

            <div className="space-y-3">
              {settingsView === 'main' && (
                <>
                  <button
                    onClick={openNameEdit}
                    className={`w-full ${getButtonClass('pink')} text-white px-4 py-3 rounded-xl font-bold transition-all shadow-md cursor-pointer`}
                  >
                    Change Name
                  </button>

                  <button
                    onClick={openZipcodeEdit}
                    className={`w-full ${getButtonClass('blue')} text-white px-4 py-3 rounded-xl font-bold transition-all shadow-md cursor-pointer`}
                  >
                    Change Zipcode
                  </button>

                  <button
                    onClick={resetPet}
                    className={`w-full ${getButtonClass('purple')} text-white px-4 py-3 rounded-xl font-bold transition-all shadow-md cursor-pointer`}
                  >
                    Choose Different Pet
                  </button>

                  <button
                    onClick={openDisplayEdit}
                    className="w-full bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500 text-white px-4 py-3 rounded-xl font-bold transition-all shadow-md cursor-pointer"
                  >
                    Display Color
                  </button>
                </>
              )}

              {settingsView === 'name' && (
                <>
                  <div>
                    <label className="block text-purple-600 font-semibold text-sm mb-2">Name</label>
                    <input
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border-2 border-purple-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                      placeholder="Enter your name"
                    />
                  </div>

                  <button
                    onClick={saveName}
                    className={`w-full ${getButtonClass('green')} text-white px-4 py-3 rounded-xl font-bold transition-all shadow-md cursor-pointer`}
                  >
                    Save
                  </button>

                  <button
                    onClick={() => setSettingsView('main')}
                    className={`w-full ${getButtonClass('gray')} text-white px-4 py-3 rounded-xl font-bold transition-all shadow-md cursor-pointer`}
                  >
                    Go Back
                  </button>
                </>
              )}

              {settingsView === 'zipcode' && (
                <>
                  <div>
                    <label className="block text-purple-600 font-semibold text-sm mb-2">Zipcode</label>
                    <input
                      type="text"
                      value={tempZipcode}
                      onChange={(e) => setTempZipcode(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border-2 border-purple-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                      placeholder="Enter your zipcode"
                    />
                  </div>

                  <button
                    onClick={saveZipcode}
                    className={`w-full ${getButtonClass('green')} text-white px-4 py-3 rounded-xl font-bold transition-all shadow-md cursor-pointer`}
                  >
                    Save
                  </button>

                  <button
                    onClick={() => setSettingsView('main')}
                    className={`w-full ${getButtonClass('gray')} text-white px-4 py-3 rounded-xl font-bold transition-all shadow-md cursor-pointer`}
                  >
                    Go Back
                  </button>
                </>
              )}

              {settingsView === 'display' && (
                <>
                  <p className="text-purple-600 font-semibold text-sm mb-3">Choose your display theme:</p>

                  <button
                    onClick={() => selectDisplayMode('ombre')}
                    className={`w-full bg-gradient-to-r from-pink-400 to-purple-400 text-white px-4 py-3 rounded-xl font-bold hover:from-pink-500 hover:to-purple-500 transition-all shadow-md cursor-pointer ${displayMode === 'ombre' ? 'ring-4 ring-purple-300' : ''}`}
                  >
                    Ombre {displayMode === 'ombre' ? '✓' : ''}
                  </button>

                  <button
                    onClick={() => selectDisplayMode('plain')}
                    className={`w-full bg-blue-400 text-white px-4 py-3 rounded-xl font-bold hover:bg-blue-500 transition-all shadow-md cursor-pointer ${displayMode === 'plain' ? 'ring-4 ring-blue-300' : ''}`}
                  >
                    Plain Color {displayMode === 'plain' ? '✓' : ''}
                  </button>

                  <button
                    onClick={() => selectDisplayMode('pastel')}
                    className={`w-full bg-pink-200 text-purple-700 border-2 border-pink-300 px-4 py-3 rounded-xl font-bold hover:bg-pink-300 transition-all shadow-md cursor-pointer ${displayMode === 'pastel' ? 'ring-4 ring-pink-300' : ''}`}
                  >
                    Pastel Mode {displayMode === 'pastel' ? '✓' : ''}
                  </button>

                  <button
                    onClick={() => selectDisplayMode('light')}
                    className={`w-full bg-white text-gray-800 border-2 border-gray-300 px-4 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-md cursor-pointer ${displayMode === 'light' ? 'ring-4 ring-gray-300' : ''}`}
                  >
                    Light Mode {displayMode === 'light' ? '✓' : ''}
                  </button>

                  <button
                    onClick={() => selectDisplayMode('dark')}
                    className={`w-full bg-gray-800 text-white px-4 py-3 rounded-xl font-bold hover:bg-gray-900 transition-all shadow-md cursor-pointer ${displayMode === 'dark' ? 'ring-4 ring-gray-600' : ''}`}
                  >
                    Dark Mode {displayMode === 'dark' ? '✓' : ''}
                  </button>

                  <button
                    onClick={() => setSettingsView('main')}
                    className={`w-full ${getButtonClass('gray')} text-white px-4 py-3 rounded-xl font-bold transition-all shadow-md cursor-pointer`}
                  >
                    Go Back
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* About Modal */}
      {showAbout && (
        <div className="fixed inset-0 bg-gray-900/20 flex items-center justify-center z-50" onClick={() => setShowAbout(false)}>
          <div className="bg-white rounded-2xl p-6 w-96 mx-4 border-4 border-purple-300 shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button
              onClick={() => setShowAbout(false)}
              className="absolute top-3 right-3 border-2 border-gray-400 hover:border-gray-600 text-gray-600 hover:text-gray-800 w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-xl transition-all cursor-pointer bg-white"
            >
              ✕
            </button>

            <h2 className="text-purple-700 text-2xl font-bold mb-6 text-center">About</h2>

            <div className="space-y-4 text-gray-700">
              <p className="text-sm leading-relaxed">
                Your journal entries are automatically saved at the end of each day when it hits 12 AM your time. Feel free to edit, delete, or add text throughout the day - whatever you have at midnight will be saved.
              </p>
              <p className="text-sm leading-relaxed">
                Do not store private information, illegal information, or passwords here. We will not take, store, or read any data from your journal entry but if anyone has access to your machine they will have access to your private information.
              </p>
              <p className="text-sm leading-relaxed">
                Feel free to let us know what feature you would like on this app!
              </p>
              <p className="text-xs text-center text-gray-500 pt-2 border-t border-gray-200">
                Made with love by Camilla and the help of Claude Code 💜
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
