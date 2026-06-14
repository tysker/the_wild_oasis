import type { Cabin as CabinType } from '../../types/cabin';
import Button from '../../ui/Button';
import FileInput from '../../ui/FileInput';
import Form from '../../ui/Form';
import FormRow from '../../ui/FormRow';
import Input from '../../ui/Input';
import Textarea from '../../ui/Textarea';
import { useCreateCabin } from './useCreateCabin';
import { useEditCabin } from './useUpdateCabin';
import { type FieldErrors, useForm } from 'react-hook-form';

type CreateCabinFormPops = {
  cabinToUpdate?: CabinType;
  onCloseModal?: () => void;
};

function CreateCabinForm({ cabinToUpdate = {} as CabinType, onCloseModal }: CreateCabinFormPops) {
  const { id: updateId, ...updateValues } = cabinToUpdate;
  const isUpdateSession = Boolean(updateId);

  // ======== React Query ================

  const { isCreating, createCabin } = useCreateCabin();
  const { isUpdating, updateCabin } = useEditCabin();

  // disable input fields when creating or editing is in process
  const isWorking = isCreating || isUpdating;

  // ======== Form Data ========

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<CabinType>({
    defaultValues: isUpdateSession ? updateValues : {},
    // will get updated once values returns but i
    // like the solution where you add the data in the reset function a lot better
    // values: isEditSession ? editValues : {},
  });

  function onSubmit(data: CabinType) {
    const image = typeof data.image === 'string' ? data.image : data.image[0];

    if (isUpdateSession) {
      updateCabin(
        { newCabinData: { ...data, image }, id: updateId },
        {
          onSuccess: (data) => {
            reset(data);
            onCloseModal?.();
          },
        },
      );
    } else {
      createCabin(
        { ...data, image: image },
        {
          onSuccess: (data) => {
            reset();
            onCloseModal?.();
          },
        },
      );
    }
  }

  function onError(error: FieldErrors<CabinType>) {
    // console.log(error);
  }

  // ============= Form  =================

  return (
    <Form onSubmit={handleSubmit(onSubmit, onError)} type={onCloseModal ? 'modal' : 'regular'}>
      <FormRow label="Cabin name" htmlFor="name" error={errors?.name?.message}>
        <Input
          type="text"
          id="name"
          disabled={isWorking}
          {...register('name', {
            required: 'This field is required',
          })}
        />
      </FormRow>

      <FormRow label="Maximum capacity" htmlFor="maxCapacity" error={errors?.maxCapacity?.message}>
        <Input
          type="number"
          id="maxCapacity"
          disabled={isWorking}
          {...register('maxCapacity', {
            required: 'This field is required',
            min: {
              value: 1,
              message: 'Capacity should be at least 1',
            },
          })}
        />
      </FormRow>

      <FormRow label="Regular price" htmlFor="regularPrice" error={errors?.regularPrice?.message}>
        <Input
          type="number"
          id="regularPrice"
          disabled={isWorking}
          {...register('regularPrice', {
            required: 'This field is required',
            min: {
              value: 1,
              message: 'Capacity should be at least 1',
            },
          })}
        />
      </FormRow>

      <FormRow label="Discount" htmlFor="discount" error={errors?.discount?.message}>
        <Input
          type="number"
          id="discount"
          disabled={isWorking}
          defaultValue={0}
          {...register('discount', {
            required: 'This field is required',
            validate: (value) =>
              Number(value) <= Number(getValues().regularPrice) || 'Discount should be less than regular price',
          })}
        />
      </FormRow>

      <FormRow label="Description for website" htmlFor="description" error={errors?.description?.message}>
        <Textarea
          id="description"
          defaultValue=""
          disabled={isWorking}
          {...register('description', {
            required: 'This field is required',
          })}
        />
      </FormRow>

      <FormRow label="Cabin photo" htmlFor="image">
        <FileInput
          id="image"
          accept="image/*"
          {...register('image', {
            required: isUpdateSession ? false : 'This field is required',
          })}
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button variation="secondary" type="reset" onClick={() => onCloseModal?.()}>
          Cancel
        </Button>
        <Button disabled={isWorking}>{isUpdateSession ? 'Edit cabin' : 'Create new cabin'}</Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
