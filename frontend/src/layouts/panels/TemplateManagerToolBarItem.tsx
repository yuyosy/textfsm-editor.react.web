import { useStableCallback } from '@/hooks/useStableCallback';
import { Button, Menu } from '@mantine/core';
import { useSetState } from '@mantine/hooks';
import {
  IconBookmarks,
  IconEdit,
  IconFileExport,
  IconFileImport,
  IconListDetails,
  IconPlus,
} from '@tabler/icons-react';
import { SaveTemplateModal } from '../modals/SaveTemplateModal';
import { LoadTemplateModal } from '../modals/LoadTemplateModal';
import { EditTemplatesModal } from '../modals/EditTemplatesModal';
import { ImportTemplatesModal } from '../modals/ImportTemplatesModal';
import { ExportTemplatesModal } from '../modals/ExportTemplatesModal';

type Props = {
  valueRef: React.MutableRefObject<string>;
  setTemplateValue: (value: string) => void;
};

export const TemplateManagerToolBarItem = ({ valueRef, setTemplateValue }: Props) => {
  // Element State
  const [modalState, setModalState] = useSetState<Record<string, boolean>>({
    save: false,
    load: false,
    edit: false,
    import: false,
    export: false,
  });

  // Functions
  const changeModalState = (target: string, toOpen: boolean) => {
    return () => {
      setModalState({ [target]: toOpen });
    };
  };

  const openSaveModal = useStableCallback(changeModalState('save', true));
  const openLoadModal = useStableCallback(changeModalState('load', true));
  const openEditModal = useStableCallback(changeModalState('edit', true));
  const openImportModal = useStableCallback(changeModalState('import', true));
  const openExportModal = useStableCallback(changeModalState('export', true));
  const closeSaveModal = useStableCallback(changeModalState('save', false));
  const closeLoadModal = useStableCallback(changeModalState('load', false));
  const closeEditModal = useStableCallback(changeModalState('edit', false));
  const closeImportModal = useStableCallback(changeModalState('import', false));
  const closeExportModal = useStableCallback(changeModalState('export', false));

  return (
    <>
      {/* Modals */}
      <SaveTemplateModal
        opened={modalState['save']}
        close={closeSaveModal}
        valueRef={valueRef}
      ></SaveTemplateModal>
      <LoadTemplateModal
        opened={modalState['load']}
        close={closeLoadModal}
        setTemplateValueFunc={setTemplateValue}
      ></LoadTemplateModal>
      <EditTemplatesModal opened={modalState['edit']} close={closeEditModal}></EditTemplatesModal>
      <ImportTemplatesModal
        opened={modalState['import']}
        close={closeImportModal}
      ></ImportTemplatesModal>
      <ExportTemplatesModal
        opened={modalState['export']}
        close={closeExportModal}
      ></ExportTemplatesModal>

      {/* Menu */}
      <Menu
        position="bottom-start"
        trigger="hover"
        openDelay={100}
        closeDelay={400}
        withArrow
        shadow="md"
        width={400}
      >
        <Menu.Target>
          <Button
            variant="filled"
            size="xs"
            leftIcon={<IconListDetails size={18} strokeWidth={1.5} />}
          >
            Templates
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item icon={<IconPlus size={14} />} onClick={openSaveModal}>
            Save Template
          </Menu.Item>
          <Menu.Item icon={<IconBookmarks size={14} />} onClick={openLoadModal}>
            Load Template
          </Menu.Item>
          <Menu.Item icon={<IconEdit size={14} />} onClick={openEditModal}>
            Edit Templates
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item icon={<IconFileImport size={14} />} onClick={openImportModal}>
            Import Templates
          </Menu.Item>
          <Menu.Item icon={<IconFileExport size={14} />} onClick={openExportModal}>
            Export Templates
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
};
