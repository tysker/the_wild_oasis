import Button from '../../ui/Button';
import Modal from '../../ui/Modal';
import CreateCabinForm from './CreateCabinForm';
import { useState } from 'react';

export default function AddCabin() {
  const [isOpenModal, setIsOpenModel] = useState(false);
  return (
    <div>
      <Button onClick={() => setIsOpenModel((show) => !show)}>Add new Cabin</Button>

      {isOpenModal && (
        <Modal onCloseModal={() => setIsOpenModel(false)}>
          <CreateCabinForm onCloseModal={() => setIsOpenModel(false)} />
        </Modal>
      )}
    </div>
  );
}
