import { RefObject } from 'react';

import { Flex, SegmentedControl } from '@mantine/core';
import { ImperativePanelHandle } from 'react-resizable-panels';

import { Columns2, PanelLeftClose, PanelRightClose } from 'lucide-react';
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
      color="var(--mantine-primary-color-filled)"
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
        {
          label: (
            <Flex align="center" gap={4}>
              <Columns2 size={14} strokeWidth={1.4} />
              Both
            </Flex>
          ),
          value: 'both',
        },
        {
          label: (
            <Flex align="center" gap={4}>
              <PanelRightClose size={14} strokeWidth={1.4} />
              Data
            </Flex>
          ),
          value: 'data',
        },
        {
          label: (
            <Flex align="center" gap={4}>
              <PanelLeftClose size={14} strokeWidth={1.4} />
              Template
            </Flex>
          ),
          value: 'template',
        },
      ]}
    />
  );
};
