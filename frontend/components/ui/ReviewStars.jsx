export default function ReviewStars({ rating = 0 }) {
  return (
    <div className="flex space-x-1">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967h4.175c.969 0 1.371 1.24.588 1.81l-3.385 2.462 1.286 3.966c.3.921-.755 1.688-1.54 1.118L10 13.347l-3.361 2.403c-.784.57-1.838-.197-1.539-1.118l1.285-3.966-3.385-2.462c-.783-.57-.38-1.81.588-1.81h4.175l1.286-3.967z" />
        </svg>
      ))}
    </div>
  );
}
