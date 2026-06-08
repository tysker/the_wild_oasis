import styled, { css } from 'styled-components';

interface RowProps {
  type?: 'horizontal' | 'vertical'; // ← union type, optional with ?
}

const Row = styled.div<RowProps>`
  display: flex;

  ${(props) =>
    (props.type ?? 'vertical') === 'horizontal' &&
    css`
      justify-content: space-between;
      align-items: center;
    `}

  ${(props) =>
    (props.type ?? 'vertical') === 'vertical' &&
    css`
      flex-direction: column;
      gap: 1.6rem;
    `}
`;

export default Row;
