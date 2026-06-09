import { deleteCabin } from '../../services/apiCabins';
import type { Cabin } from '../../types/cabin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export function useDeleteCabin() {
  const queryClient = useQueryClient();

  const { isPending: isDeleting, mutate: deleteCabinMutation } = useMutation<
    Cabin, // return type
    Error, // error type
    number // passed to mutate()
  >({
    mutationFn: (id) => deleteCabin(id),
    onSuccess: () => {
      toast.success('Cabin successfully deleted');
      queryClient.invalidateQueries({
        queryKey: ['cabins'],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isDeleting, deleteCabinMutation };
}
