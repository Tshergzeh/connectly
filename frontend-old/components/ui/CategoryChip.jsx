export default function CategoryChip({ label, active = false, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`px-3 py-1.5 sm:py-4 sm:py-2 text-xs sm:text-sm rounded-full border transition focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1 ${
        active
          ? 'bg-indigo-600 text-white border-indigo-600'
          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
      }`}
    >
      <span className="truncate">{label}</span>
    </button>
  );
}
