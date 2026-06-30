import { getBookings } from '../../services/apiBookings';
import { useQuery } from '@tanstack/react-query';

export function useBookings() {
  const {
    data: bookings,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['bookings'],
    queryFn: getBookings,
  });

  return { bookings, error, isLoading };
}
