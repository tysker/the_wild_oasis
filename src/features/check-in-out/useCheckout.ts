import { updateBooking } from '../../services/apiBookings';
import type { Booking } from '../../types/booking';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export function useCheckout() {
  const queryClient = useQueryClient();

  const { mutate: checkout, isPending: isCheckingOut } = useMutation<Booking, Error, number>({
    mutationFn: (bookingId) =>
      updateBooking(bookingId, {
        status: 'checked-out',
      }),

    onSuccess: (data) => {
      toast.success(`Booking #${data.id} successfully checked out.`);
      queryClient.invalidateQueries({ type: 'active' });
    },

    onError: () => toast.error('There was an error while checking out.'),
  });

  return { checkout, isCheckingOut };
}
