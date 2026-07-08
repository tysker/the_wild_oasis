import { useOutsideMouseClick } from '../hooks/useOutsideMouseClick';
import type { Booking } from '../types/booking';
import { createContext, useContext, useState } from 'react';
import type { MouseEvent, ReactElement, ReactNode, RefObject } from 'react';
import { HiEllipsisVertical } from 'react-icons/hi2';
import styled from 'styled-components';

type Position = {
  x: number;
  y: number;
};

type MenuContextProps = {
  openId: string;
  close: () => void;
  open: (id: string) => void;
  position: Position;
  setPosition: (position: Position) => void;
};

const Menu = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const StyledToggle = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-grey-200);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-700);
  }
`;

const StyledList = styled.ul<{ position: Position; ref: RefObject<HTMLDivElement> }>`
  position: fixed;

  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-md);
  border-radius: var(--border-radius-md);

  right: ${(props) => props.position.x}px;
  top: ${(props) => props.position.y}px;
`;

const StyledButton = styled.button`
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 1.2rem 2.4rem;
  font-size: 1.4rem;
  transition: all 0.2s;

  display: flex;
  align-items: center;
  gap: 1.6rem;

  &:hover {
    background-color: var(--color-grey-200);
  }

  & svg {
    width: 1.6rem;
    height: 1.6rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }
`;

const MenuContext = createContext<MenuContextProps | undefined>(undefined);

function useMenuContext() {
  const context = useContext(MenuContext);

  if (!context) {
    throw new Error('useMenuContext must be inside of Menus');
  }
  return context;
}

function Menus({ children }: { children: ReactNode }) {
  const [openId, setOpenId] = useState<string>('');
  const [position, setPosition] = useState<Position | null>(null);

  const close = () => setOpenId('');
  const open = setOpenId;

  return (
    <MenuContext.Provider value={{ openId, close, open, position, setPosition }}>
      {children}
    </MenuContext.Provider>
  );
}

function Toggle({ id }: { id: string }) {
  const { openId, close, open, setPosition } = useMenuContext();

  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    const rect = (e.target as HTMLElement).closest('button')?.getBoundingClientRect();
    const position = {
      x: window.innerWidth - rect.width - rect.x,
      y: rect.y + rect.height + 8,
    };

    setPosition(position);

    if (openId === '' || openId !== id) {
      open(id);
    } else {
      close();
    }
  }

  return (
    <StyledToggle onClick={handleClick}>
      <HiEllipsisVertical />
    </StyledToggle>
  );
}

function List({ id, children }: { id: string; children: ReactNode }) {
  const { openId, position, close } = useMenuContext();
  const ref = useOutsideMouseClick(close);

  if (openId !== id || !position) return null;

  return (
    <StyledList position={position} ref={ref}>
      {children}
    </StyledList>
  );
}

function Button({
  children,
  icon,
  onClick,
}: {
  children: ReactNode;
  icon: ReactElement;
  onClick?: () => void;
}) {
  const { close } = useMenuContext();

  function handleClick() {
    onClick?.();
    close();
  }

  return (
    <li>
      <StyledButton onClick={handleClick}>
        {icon}
        <span>{children}</span>
      </StyledButton>
    </li>
  );
}

Menus.Menu = Menu;
Menus.Toggle = Toggle;
Menus.List = List;
Menus.Button = Button;

export default Menus;
