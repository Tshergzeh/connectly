import { BookingStatus } from '~/shared/types';

function StatusBadge({ status }: { status: BookingStatus }) {
  const colors: Record<BookingStatus, string> = {
    Paid: 'bg-green-100 text-green-700',
    Completed: 'bg-blue-100 text-blue-700',
    Pending: 'bg-yellow-100 text-yellow-700',
    Cancelled: 'bg-red-100 text-red-700',
  };

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
      {status}
    </span>
  );
}
