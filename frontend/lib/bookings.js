import api from './api';

export async function createBooking(serviceId) {
    const token = sessionStorage.getItem('accessToken');
    return await api.post(
        `/bookings/${serviceId}`,
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
}
