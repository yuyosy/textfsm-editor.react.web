import { RefObject } from 'react';

import { SegmentedControl } from '@mantine/core';
import { ImperativePanelHandle } from 'react-resizable-panels';

import { PanelLayoutType } from './types';

interface PanelSelectorProps {
  mainPanelLyout: PanelLayoutType;
  setMainPanelLyout: (value: PanelLayoutType) => void;
  dataPanelImperativeHandleRef: RefObject<ImperativePanelHandle>;
  templatePanelImperativeHandleRef: RefObject<ImperativePanelHandle>;
}

export const PanelSelector = ({
  mainPanelLyout,
  setMainPanelLyout,
  dataPanelImperativeHandleRef,
  templatePanelImperativeHandleRef,
}: PanelSelectorProps) => {
  return (
    <SegmentedControl
      size="xs"
      color="blue"
      value={mainPanelLyout}
      onChange={value => {
        if (value === 'both') {
          dataPanelImperativeHandleRef?.current?.expand();
          templatePanelImperativeHandleRef?.current?.expand();
        } else if (value === 'data') {
          dataPanelImperativeHandleRef?.current?.expand();
          templatePanelImperativeHandleRef?.current?.collapse();
        } else if (value === 'template') {
          dataPanelImperativeHandleRef?.current?.collapse();
          templatePanelImperativeHandleRef?.current?.expand();
        }
        setMainPanelLyout(value as PanelLayoutType);
      }}
      data={[
        { label: 'Both', value: 'both' },
        { label: 'Data', value: 'data' },
        { label: 'Template', value: 'template' },
      ]}
    />
  );
};
