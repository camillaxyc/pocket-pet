import { useState, useEffect } from 'react';

const starterTodos = {
  cat: "Give your cat a gentle pat 🐱",
  dog: "Take your dog for a walk 🐶",
  bunny: "Give your bunny some fresh veggies 🐰"
};

const getToday = () => new Date().toDateString();

export default function TodoList({ username, petType, displayMode = 'ombre' }) {
  const [todos, setTodos] = useState(() => {
    const today = getToday();
    const saved = localStorage.getItem('todosHistory');

    if (saved) {
      const history = JSON.parse(saved);
      // Only load todos for today
      if (history[today]) {
        return history[today];
      }
    }

    // Add starter todo based on pet type for new day
    return [{
      id: Date.now(),
      text: starterTodos[petType] || "Complete your first task!",
      completed: false
    }];
  });
  const [input, setInput] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [draggedId, setDraggedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const today = getToday();
    const saved = localStorage.getItem('todosHistory');
    const history = saved ? JSON.parse(saved) : {};

    // Store todos under today's date
    history[today] = todos;
    localStorage.setItem('todosHistory', JSON.stringify(history));

    // Check if all todos are completed
    if (todos.length > 0 && todos.every(todo => todo.completed)) {
      setShowCelebration(true);
      // Auto-hide after 2 seconds
      const timer = setTimeout(() => {
        setShowCelebration(false);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      setShowCelebration(false);
    }
  }, [todos]);

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const addTodo = () => {
    if (input.trim() === '') return;
    setTodos([...todos, { id: Date.now(), text: input, completed: false }]);
    setInput('');
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  const startEdit = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = (id) => {
    if (editText.trim() === '') {
      setEditingId(null);
      return;
    }
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, text: editText.trim() } : todo
    ));
    setEditingId(null);
    setEditText('');
  };

  const handleEditKeyPress = (e, id) => {
    if (e.key === 'Enter') {
      saveEdit(id);
    } else if (e.key === 'Escape') {
      setEditingId(null);
      setEditText('');
    }
  };

  const handleDragStart = (e, id) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, id) => {
    e.preventDefault();
    if (draggedId === id) return;

    const draggedIndex = todos.findIndex(todo => todo.id === draggedId);
    const targetIndex = todos.findIndex(todo => todo.id === id);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newTodos = [...todos];
    const [draggedItem] = newTodos.splice(draggedIndex, 1);
    newTodos.splice(targetIndex, 0, draggedItem);

    setTodos(newTodos);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
  };

  const getBgClass = () => {
    if (displayMode === 'ombre') {
      return 'bg-gradient-to-br from-pink-200 to-purple-300';
    } else if (displayMode === 'dark') {
      return 'bg-gray-700';
    } else if (displayMode === 'light') {
      return 'bg-white';
    } else if (displayMode === 'pastel') {
      return 'bg-pink-50';
    } else {
      return 'bg-pink-200';
    }
  };

  const getButtonClass = (baseColor) => {
    if (displayMode === 'ombre') {
      const gradients = {
        purple: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
        pink: 'bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500'
      };
      return gradients[baseColor] || gradients.purple;
    } else if (displayMode === 'dark') {
      if (baseColor === 'purple') {
        return 'bg-purple-500 hover:bg-purple-600';
      }
      return 'bg-gray-700 hover:bg-gray-600';
    } else if (displayMode === 'light') {
      if (baseColor === 'purple') {
        return 'bg-purple-500 hover:bg-purple-600 text-white shadow-md hover:shadow-lg';
      }
      return 'bg-gray-700 hover:bg-gray-600';
    } else if (displayMode === 'pastel') {
      const pastelColors = {
        purple: 'bg-purple-300 hover:bg-purple-400',
        pink: 'bg-pink-300 hover:bg-pink-400'
      };
      return pastelColors[baseColor] || pastelColors.purple;
    } else {
      const plainColors = {
        purple: 'bg-purple-500 hover:bg-purple-600',
        pink: 'bg-pink-400 hover:bg-pink-500'
      };
      return plainColors[baseColor] || plainColors.purple;
    }
  };

  const getCelebrationBgClass = () => {
    if (displayMode === 'dark') {
      return 'bg-gray-600';
    }
    // All other modes use light mode styling
    return 'bg-white';
  };

  const bgClass = getBgClass();

  // Pagination logic
  const TODOS_PER_PAGE = 5;
  const totalPages = Math.ceil(todos.length / TODOS_PER_PAGE);
  const startIndex = currentPage * TODOS_PER_PAGE;
  const endIndex = startIndex + TODOS_PER_PAGE;
  const currentTodos = todos.slice(startIndex, endIndex);

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Reset to first page if current page becomes invalid
  useEffect(() => {
    if (currentPage >= totalPages && totalPages > 0) {
      setCurrentPage(Math.max(0, totalPages - 1));
    }
  }, [todos.length, currentPage, totalPages]);

  const isAllComplete = totalCount > 0 && completedCount === totalCount;

  return (
    <div className={`${bgClass} rounded-2xl p-5 border-2 ${displayMode === 'dark' ? 'border-gray-600' : displayMode === 'light' ? 'border-gray-300' : 'border-pink-100'} shadow-lg relative`}>
      <div className="text-center mb-4">
        <h2 className={`${displayMode === 'dark' ? 'text-gray-300' : displayMode === 'light' ? 'text-gray-700' : 'text-purple-700'} text-xl font-bold`}>Today's Todo</h2>
      </div>

      {/* Celebration Popup */}
      {showCelebration && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className={`${getCelebrationBgClass()} rounded-2xl p-6 text-center border-4 ${displayMode === 'dark' ? 'border-gray-500' : displayMode === 'light' ? 'border-gray-400' : 'border-yellow-300'} shadow-2xl animate-[bounce_0.5s_ease-in-out_1] pointer-events-auto max-w-sm mx-4`}>
            <div className="text-5xl mb-3">🎉✨🎊</div>
            <p className={`${displayMode === 'dark' ? 'text-gray-300' : displayMode === 'light' ? 'text-gray-700' : 'text-purple-700'} font-bold text-2xl mb-2`}>
              Yay! Congrats {username}!
            </p>
            <p className={`${displayMode === 'dark' ? 'text-gray-400' : displayMode === 'light' ? 'text-gray-600' : 'text-purple-600'} text-base`}>
              You've completed all your goals for today!
            </p>
          </div>
        </div>
      )}

      <div className="flex gap-3 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a new task..."
          className={`flex-1 px-4 py-2 rounded-xl border-2 border-purple-200 ${displayMode === 'dark' ? 'text-gray-900 bg-gray-300' : 'text-gray-800 bg-white bg-opacity-70'} focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400`}
        />
        <button
          onClick={addTodo}
          className={`${getButtonClass('purple')} text-white px-5 py-2 rounded-xl font-bold transition-all shadow-md cursor-pointer`}
        >
          Add
        </button>
      </div>

      <ul className="space-y-3 mb-4 min-h-[300px]">
        {currentTodos.map(todo => (
          <li
            key={todo.id}
            draggable={editingId !== todo.id}
            onDragStart={(e) => handleDragStart(e, todo.id)}
            onDragOver={(e) => handleDragOver(e, todo.id)}
            onDragEnd={handleDragEnd}
            className={`bg-white rounded-xl p-3 flex items-center gap-3 border-2 border-pink-100 shadow-sm ${
              editingId !== todo.id ? 'cursor-move' : ''
            } ${draggedId === todo.id ? 'opacity-50' : ''}`}
          >
            <div className="text-gray-400 text-xl flex-shrink-0">⋮⋮</div>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              className={`w-5 h-5 cursor-pointer flex-shrink-0 ${
                displayMode === 'dark' || displayMode === 'light'
                  ? 'appearance-none border-2 border-gray-300 rounded checked:bg-green-500 checked:border-green-500 relative checked:after:content-["✓"] checked:after:absolute checked:after:text-white checked:after:text-sm checked:after:font-bold checked:after:left-[3px] checked:after:top-[-2px]'
                  : 'accent-pink-500'
              }`}
            />
            {editingId === todo.id ? (
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={(e) => handleEditKeyPress(e, todo.id)}
                onBlur={() => saveEdit(todo.id)}
                autoFocus
                className="flex-1 px-0 py-0 text-gray-800 bg-transparent border-b-2 border-purple-300 focus:outline-none focus:border-purple-500"
              />
            ) : (
              <span
                className="flex-1 text-gray-800 cursor-text"
                onClick={() => startEdit(todo.id, todo.text)}
              >
                {todo.text}
              </span>
            )}
            <button
              onClick={() => deleteTodo(todo.id)}
              className={`${getButtonClass('pink')} text-white px-3 py-1 rounded-lg text-sm transition-all shadow-sm cursor-pointer flex-shrink-0`}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {/* Pagination Controls - Only show if more than 5 todos */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mb-4">
          <button
            onClick={prevPage}
            disabled={currentPage === 0}
            className={`${getButtonClass('pink')} text-white px-4 py-2 rounded-xl font-bold transition-all shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            ◀
          </button>
          <span className={`${displayMode === 'dark' ? 'text-gray-300' : displayMode === 'light' ? 'text-gray-700' : 'text-purple-700'} font-semibold`}>
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages - 1}
            className={`${getButtonClass('pink')} text-white px-4 py-2 rounded-xl font-bold transition-all shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            ▶
          </button>
        </div>
      )}

      {/* Progress Bar - Moved to bottom */}
      {totalCount > 0 && (
        <div>
          <div className={`flex justify-between text-sm ${displayMode === 'dark' ? 'text-gray-300' : displayMode === 'light' ? 'text-gray-700' : 'text-purple-600'} mb-2`}>
            <span className="font-semibold">
              {isAllComplete ? 'Congrats you completed all your tasks for today!' : 'Progress'}
            </span>
            <span className="font-semibold">{completedCount}/{totalCount}</span>
          </div>
          <div className="w-full bg-white rounded-full h-4 border-2 border-purple-200 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-400 to-purple-500 transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}
