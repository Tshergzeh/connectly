export default function CategoryChip({ label, active = false, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm rounded-full border transition ${
        active
          ? 'bg-indigo-600 text-white border-indigo-600'
          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
      }`}
    >
      {label}
    </button>
  );
}
