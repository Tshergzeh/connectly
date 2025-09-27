export default function Input({ label, type = 'text', className = '', ...props }) {
  return (
    <div className="flex flex-col space-y-1">
      {label && <label className="text-xs sm:text-sm font-medium text-gray-800">{label}</label>}
      <input
        type={type}
        className="w-full px-2.5 py-2 sm:px-3 sm:py-2.5 text-sm sm:text-base border border-gray-300 text-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 focus:border-indigo-500 outline-none"
        {...props}
      />
    </div>
  );
}
