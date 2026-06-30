import { createUpdateCabin } from '../../services/apiCabins';
import type { Cabin, NewCabin } from '../../types/cabin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

type EditCabinVariables = {
  newCabinData: NewCabin;
  id: string | undefined;
};

export function useEditCabin() {
  const queryClient = useQueryClient();

  const { mutate: updateCabin, isPending: isUpdating } = useMutation<Cabin, Error, EditCabinVariables>({
    mutationFn: ({ newCabinData, id }) => createUpdateCabin(newCabinData, id),
    onSuccess: () => {
      toast.success('Cabin successfully updated');
      queryClient.invalidateQueries({ queryKey: ['cabins'] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isUpdating, updateCabin };
}
