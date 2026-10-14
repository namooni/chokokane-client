import { useEffect, type ReactNode } from 'react';
import styled from 'styled-components';
import { colors } from '../../theme/palette';

type BottomSheetProps = {
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export const BottomSheet = ({ title, onClose, children }: BottomSheetProps) => {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <Backdrop
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <Panel role="dialog" aria-modal="true" aria-label={title}>
        <ScrollContent>{children}</ScrollContent>
      </Panel>
    </Backdrop>
  );
};

const Backdrop = styled.div`
  position: fixed;
  z-index: 2000;
  inset: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: ${colors.overlay};
`;
const Panel = styled.div`
  display: flex;
  width: 100%;
  max-width: 430px;
  flex-direction: column;
  max-height: 90dvh;
  overflow: hidden;
  padding-top: 24px;
  border-radius: 24px 24px 0 0;
  background: ${colors.surfaceRaised};
`;
const ScrollContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior-y: contain;
  padding: 0 20px calc(24px + env(safe-area-inset-bottom));
  > * {
    flex-shrink: 0;
  }
`;
