export default function Spinner({ message = 'Loading...' }) {
  return (
    <>
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/80 z-50">
        <div className="h-8 w-8 border-2 border-4 border-t-transparent border-indigo-600 rounded-full animate-spin"></div>
        <p className="mt-3 text-gray-700 font-medium">{message}</p>
      </div>
    </>
  );
}
