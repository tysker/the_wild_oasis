import { updateSetting as updateSettingApi } from '../../services/apiSettings';
import type { Setting } from '../../types/setting';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

type EditSettingsVariable = Partial<Setting>;

export function useUpdateSetting() {
  const queryClient = useQueryClient();

  const { mutate: updateSetting, isPending: isUpdating } = useMutation<
    Setting,
    Error,
    EditSettingsVariable
  >({
    mutationFn: (newSettingData) => updateSettingApi(newSettingData),
    onSuccess: () => {
      toast.success('Setting successfully updated');
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isUpdating, updateSetting };
}
