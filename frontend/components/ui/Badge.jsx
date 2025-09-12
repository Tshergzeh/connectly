export default function Badge({ status }) {
  const statusColors = {
    Pending: 'bg-yellow-100 text-yellow-800',
    Paid: 'bg-blue-100 text-blue-800',
    Completed: 'bg-green-100 text-green-800',
    Cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}
    >
      {status}
    </span>
  );
}
