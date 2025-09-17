export default function BookingCard({ booking }) {
  return (
    <div className="p-4 rounded-lg shadow bg-white mb-4">
      <h2 className="font-semibold text-lg text-gray-800">{booking.service.title}</h2>
      <p className="text-sm text-gray-600">
        Customer: {booking.customer.name || 'N/A'} | Email: {booking.customer.email || 'N/A'}
      </p>
      <p className="text-indigo-600 font-bold">${booking.service.price}</p>
      <p className="text-gray-500 text-sm">
        Status:
        <span className="font-semibold text-gray-500 text-sm"> {booking.status}</span>
      </p>
      <p className="text-xs text-gray-500">
        Booked on {new Date(booking.created_at).toLocaleDateString()}
      </p>
    </div>
  );
}
