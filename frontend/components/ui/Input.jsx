export default function Input({ label, type = 'text', ...props }) {
  return (
    <div className="flex flex-col space-y-1">
      {label && <label className="text-sm font-medium text-gray-800">{label}</label>}
      <input
        type={type}
        className="w-full px-3 py-2 border border-gray-300 text-gray-600 rounded-lg focus:ring-indigo-500 outline-none"
        {...props}
      />
    </div>
  );
}
