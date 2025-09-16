import { useId } from 'react';

export default function ReviewStars({ rating = 0 }) {
  const id = useId(); // ensures unique gradient ids across instances
  const r = Math.max(0, Math.min(5, rating)); // clamp 0..5

  // star path (single-line so no stray whitespace issues)
  const starPath =
    'M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967h4.175c.969 0 1.371 1.24.588 1.81l-3.385 2.462 1.286 3.966c.3.921-.755 1.688-1.54 1.118L10 13.347l-3.361 2.403c-.784.57-1.838-.197-1.539-1.118l1.285-3.966-3.385-2.462c-.783-.57-.38-1.81.588-1.81h4.175l1.286-3.967z';

  return (
    <div className="flex space-x-1" aria-label={`Rating: ${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => {
        // how much of this star should be filled (0..100)
        const fillPercent = Math.round(Math.max(0, Math.min(100, (r - i) * 100)));
        const gradId = `star-grad-${id}-${i}`;

        return (
          <svg
            key={i}
            viewBox="0 0 20 20"
            className="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="img"
          >
            <defs>
              {/* gradient with an abrupt stop at fillPercent */}
              <linearGradient id={gradId} x1="0" x2="1">
                <stop offset={`${fillPercent}%`} stopColor="#FBBF24" /> {/* gold (tailwind yellow-400) */}
                <stop offset={`${fillPercent}%`} stopColor="#D1D5DB" /> {/* gray-300 */}
              </linearGradient>
            </defs>

            {/* fill with the gradient (works for 0, partial, and 100) */}
            <path d={starPath} fill={`url(#${gradId})`} />
          </svg>
        );
      })}
    </div>
  );
}
