import { useStableCallback } from '@/hooks/useStableCallback';
import { Button, Menu } from '@mantine/core';
import { useSetState } from '@mantine/hooks';
import { Edit, FileDown, FileUp, LayoutList, LibraryBig, Plus } from 'lucide-react';
import type { editor } from 'monaco-editor';
import { EditTemplatesModal } from '../modals/EditTemplatesModal';
import { ExportTemplatesModal } from '../modals/ExportTemplatesModal';
import { ImportTemplatesModal } from '../modals/ImportTemplatesModal';
import { LoadTemplateModal } from '../modals/LoadTemplateModal';
import { SaveTemplateModal } from '../modals/SaveTemplateModal';

type Props = {
  editorRef: React.MutableRefObject<editor.IStandaloneCodeEditor | null>;
  // valueRef: React.MutableRefObject<string>;
  // setTemplateValue: (value: string) => void;
};

export const TemplateManagerToolBarItem = ({ editorRef }: Props) => {
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
        // valueRef={valueRef}
        editorRef={editorRef}
      ></SaveTemplateModal>
      <LoadTemplateModal
        opened={modalState['load']}
        close={closeLoadModal}
        // setTemplateValueFunc={setTemplateValue}
        editorRef={editorRef}
      ></LoadTemplateModal>
      <EditTemplatesModal
        opened={modalState['edit']}
        close={closeEditModal}
      ></EditTemplatesModal>
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
            leftSection={<LayoutList size={18} strokeWidth={1.5} />}
          >
            Templates
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item leftSection={<Plus size={14} />} onClick={openSaveModal}>
            Save Template
          </Menu.Item>
          <Menu.Item leftSection={<LibraryBig size={14} />} onClick={openLoadModal}>
            Load Template
          </Menu.Item>
          <Menu.Item leftSection={<Edit size={14} />} onClick={openEditModal}>
            Edit Templates
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item leftSection={<FileDown size={14} />} onClick={openImportModal}>
            Import Templates
          </Menu.Item>
          <Menu.Item leftSection={<FileUp size={14} />} onClick={openExportModal}>
            Export Templates
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
};
