import { createEditCabin } from '../services/apiCabins';
import type { Cabin, NewCabin } from '../types/cabin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

type EditCabinVariables = {
  newCabinData: NewCabin;
  id: number | undefined;
};

export function useEditCabin() {
  const queryClient = useQueryClient();

  const { isPending: isEditing, mutate: editCabin } = useMutation<
    Cabin,
    Error,
    EditCabinVariables
  >({
    mutationFn: ({ newCabinData, id }) => createEditCabin(newCabinData, id),
    onSuccess: () => {
      toast.success('Cabin successfully edited');
      queryClient.invalidateQueries({ queryKey: ['cabins'] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isEditing, editCabin };
}
