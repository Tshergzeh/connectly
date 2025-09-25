export default function Button({ children, className = '', ...props }) {
  return (
    <button
      className={`px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base bg-indigo-600 text-white hover:bg-indigo-800 transition disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
