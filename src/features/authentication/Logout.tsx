import ButtonIcon from '../../ui/ButtonIcon';
import SpinnerMini from '../../ui/SpinnerMini';
import { useLogout } from './useLogout';
import { HiArrowRightOnRectangle } from 'react-icons/hi2';

function Logout() {
  const { logout, isLoading: isPending } = useLogout();

  return (
    <ButtonIcon disabled={isPending} onClick={logout}>
      {!isPending ? <HiArrowRightOnRectangle /> : <SpinnerMini />}
    </ButtonIcon>
  );
}

export default Logout;
