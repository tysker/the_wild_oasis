import { updateBooking } from '../../services/apiBookings';
import type { Booking } from '../../types/booking';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

type CheckinVariables = {
  bookingId: number;
  breakfast: {
    hasBreakfast?: boolean;
    extrasPrice?: number;
    totalPrice?: number;
  };
};

export function useCheckin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: checkin, isPending: isCheckingIn } = useMutation<
    Booking,
    Error,
    CheckinVariables
  >({
    mutationFn: ({ bookingId, breakfast }) =>
      updateBooking(bookingId, {
        status: 'checked-in',
        isPaid: true,
        ...breakfast,
      }),

    onSuccess: (data) => {
      toast.success(`Booking #${data.id} successfully checked in.`);
      queryClient.invalidateQueries({ type: 'active' });
      navigate('/');
    },

    onError: () => toast.error('There was an error while checking in.'),
  });

  return { checkin, isCheckingIn };
}
