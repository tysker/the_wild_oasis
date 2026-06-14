import { useOutsideMouseClick } from '../hooks/useOutsideMouseClick';
import { cloneElement, createContext, type ReactElement, type ReactNode, useContext, useState } from 'react';
import { createPortal } from 'react-dom';
import { HiXMark } from 'react-icons/hi2';
import styled from 'styled-components';

const StyledModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 3.2rem 4rem;
  transition: all 0.5s;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: var(--backdrop-color);
  backdrop-filter: blur(4px);
  z-index: 1000;
  transition: all 0.5s;
`;

const Button = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;
  position: absolute;
  top: 1.2rem;
  right: 1.9rem;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    /* Sometimes we need both */
    /* fill: var(--color-grey-500);
    stroke: var(--color-grey-500); */
    color: var(--color-grey-500);
  }
`;

type WindowProps = {
  children: ReactElement;
  name: string;
};

type ModalContextProps = {
  open: (openName: string) => void;
  openName: string;
  close: () => void;
};

type OpenProps = {
  children: ReactElement;
  opens: string;
};

// ============================================================
// CONTEXT
// ============================================================

// Creates a context that holds the shared modal state.
// 'undefined' is the default — it means no Provider is wrapping the component yet.
const ModalContext = createContext<ModalContextProps | undefined>(undefined);

// Custom hook that safely accesses the modal context.
// Any component that calls useModal() must be inside a <Modal> —
// the error throw protects against using it outside.
function useModalContext() {
  const context = useContext(ModalContext);

  // If context is undefined, the component is used outside <Modal.Provider>
  if (!context) throw new Error('useModal must be used within a Modal');

  // After the guard, TypeScript knows context is ModalContextProps (not undefined)
  return context;
}

// ============================================================
// MODAL — the root component, acts as the Provider
// ============================================================

function Modal({ children }: { children: ReactNode }) {
  // openName tracks WHICH window is currently open, identified by a string name.
  // Empty string '' means no modal is open.
  const [openName, setOpenName] = useState<string>('');

  // close resets openName to '' — effectively closing any open modal
  const close = () => setOpenName('');

  // open IS setOpenName — calling open('cabin') sets openName to 'cabin'
  const open = setOpenName;

  return (
    // Provide open, close, and openName to all children via context
    // Any nested component can call useModal() to access these
    <ModalContext.Provider value={{ open, close, openName }}>{children}</ModalContext.Provider>
  );
}

// ============================================================
// OPEN — the trigger button component
// ============================================================

function Open({ children, opens: opensWindowName }: OpenProps) {
  // Get the open function from context
  const { open } = useModalContext();

  // cloneElement copies the child element (e.g. a Button) and injects
  // a new onClick prop into it — without modifying the original component.
  // The cast tells TypeScript the child accepts an onClick prop.
  return cloneElement(children as ReactElement<{ onClick?: () => void }>, {
    // When the button is clicked, open() sets openName to the window name,
    // which triggers the matching <Modal.Window name="..."> to render.
    onClick: () => open(opensWindowName),
  });
}

// ============================================================
// WINDOW — the actual modal content
// ============================================================

function Window({ children, name }: WindowProps) {
  // Get openName (which window should be open) and close from context
  const { openName, close } = useModalContext();

  // Attach a ref to the modal div so clicks outside it can be detected.
  // useOutsideMouseClick calls close() when a click outside ref.current is detected.
  const ref = useOutsideMouseClick(close);

  // If this window's name doesn't match the currently open name, render nothing.
  // This is how only one modal shows at a time.
  if (name !== openName) return null;

  // createPortal renders the modal directly into document.body,
  // outside the normal React tree — this avoids CSS stacking/overflow issues
  // where a parent's overflow:hidden or z-index would clip the modal.
  return createPortal(
    <Overlay>
      {/* ref is attached here so outside clicks are detected relative to this div */}
      <StyledModal ref={ref}>
        {/* Close button in the top corner */}
        <Button onClick={close}>
          <HiXMark />
        </Button>

        <div>
          {/* cloneElement injects onCloseModal into the child (e.g. a form),
              so the child can close the modal itself after e.g. a submit */}
          {cloneElement(children as ReactElement<{ onCloseModal?: () => void }>, {
            onCloseModal: close,
          })}
        </div>
      </StyledModal>
    </Overlay>,
    document.body, // ← mount point outside the React tree
  );
}

// ============================================================
// Attach Open and Window as static properties on Modal,
// so they can be used as <Modal.Open> and <Modal.Window>
// This keeps the API grouped and clear at the call site:
//
//   <Modal>
//     <Modal.Open opens="cabin-form">
//       <Button>Add Cabin</Button>
//     </Modal.Open>
//     <Modal.Window name="cabin-form">
//       <CreateCabinForm />
//     </Modal.Window>
//   </Modal>
// ============================================================
Modal.Open = Open;
Modal.Window = Window;

export default Modal;
