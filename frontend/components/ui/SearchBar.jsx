export default function SearchBar({ ...props }) {
  return (
    <div className="flex items-center w-full max-w-xl px-4 py-2 bg-white border rounded-full shadow-sm">
      <svg
        className="w-5 h-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z" />
      </svg>
      <input
        type="text"
        placeholder="Search..."
        className="flex-1 px-2 bg-transparent focus:outline-none"
        {...props}
      />
    </div>
  );
}
