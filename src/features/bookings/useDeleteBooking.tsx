import { deleteBooking } from '../../services/apiBookings';
import type { Booking } from '../../types/booking';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export function useDeleteBooking() {
  const queryClient = useQueryClient();

  const { isPending: isDeleting, mutate: deleteBookingMutation } = useMutation<
    Booking, // return type
    Error, // error type
    string // passed to mutate()
  >({
    mutationFn: (id) => deleteBooking(id),
    onSuccess: () => {
      toast.success('Booking successfully deleted');
      queryClient.invalidateQueries({
        queryKey: ['bookings'],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isDeleting, deleteBookingMutation };
}
