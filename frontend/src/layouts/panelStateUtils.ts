import { RefObject } from 'react';
import { PanelLayoutType } from './types';
import { ImperativePanelHandle } from 'react-resizable-panels';

export const setSegmentedControlPanelState = (
  activatePanelName: PanelLayoutType,
  panelImperativeHandleRef: RefObject<{
    isCollapsed: () => boolean;
    isExpanded: () => boolean;
  }>,
  currentPanelLyout: PanelLayoutType,
  setMainPanelLyout: (value: PanelLayoutType) => void
) => {
  if (currentPanelLyout === 'both' && panelImperativeHandleRef?.current?.isCollapsed()) {
    setMainPanelLyout(activatePanelName);
  }
  if (
    currentPanelLyout === activatePanelName &&
    panelImperativeHandleRef?.current?.isExpanded()
  ) {
    setMainPanelLyout('both');
  }
};

export const setChipPanelState = (
  opend: boolean,
  ref: RefObject<ImperativePanelHandle>,
  toggle: () => void
) => {
  if (opend && ref?.current?.isCollapsed()) {
    toggle();
  }
  if (!opend && ref?.current?.isExpanded()) {
    toggle();
  }
};

export const handlePanelToggle = (
  toExpand: boolean,
  ref: RefObject<ImperativePanelHandle>,
  toggle: (() => void) | null = null
) => {
  const panel = ref.current;
  if (panel && toExpand) {
    panel.expand();
  } else if (panel && !toExpand) {
    panel.collapse();
  }
  if (toggle) {
    toggle();
  }
};
