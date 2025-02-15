import { useListState } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { TemplateInfo } from '../../types';
import { ChangesState } from '../types';

const deepCopyTemplates = (templates: TemplateInfo[]): TemplateInfo[] => {
  return templates.map(template => ({
    ...template,
    tags: [...(template.tags || [])],
  }));
};

type EditingTemplateInfo = {
  original: TemplateInfo;
  current: TemplateInfo;
};

export const useTemplateModifications = (
  initialTemplates: TemplateInfo[],
  setSavedTemplates: (templates: TemplateInfo[]) => void
) => {
  const [editingTemplates, editingTemplatesHandlers] = useListState<EditingTemplateInfo>(
    deepCopyTemplates(initialTemplates).map(template => ({
      original: template,
      current: template,
    }))
  );

  const [modifications, setModifications] = useState<ChangesState>({
    orderChanged: false,
    deleteCount: 0,
    renameCount: 0,
    tagUpdateCount: 0,
  });

  const [hasModifications, setHasModifications] = useState<boolean>(false);

  useEffect(() => {
    setHasModifications(
      modifications.orderChanged ||
        modifications.deleteCount > 0 ||
        modifications.renameCount > 0 ||
        modifications.tagUpdateCount > 0
    );
  }, [modifications]);

  useEffect(() => {
    const renameCount = editingTemplates.reduce((count, template) => {
      if (template.current.label !== template.original.label) {
        return count + 1;
      }
      return count;
    }, 0);
    setModifications(prevState => ({
      ...prevState,
      renameCount,
    }));
  }, [editingTemplates]);

  const updateModification = <K extends keyof ChangesState>(
    key: K,
    value: ChangesState[K]
  ) => {
    setModifications(prevState => ({
      ...prevState,
      [key]: value,
    }));
  };

  const resetTemplateList = () => {
    editingTemplatesHandlers.setState(
      deepCopyTemplates(initialTemplates).map(template => ({
        original: template,
        current: template,
      }))
    );
    resetModifications();
  };

  const moveTemplateUp = (index: number) => {
    if (index === 0) return;
    editingTemplatesHandlers.swap({ from: index, to: index - 1 });
    updateModification('orderChanged', true);
  };

  const moveTemplateDown = (index: number) => {
    if (index === editingTemplates.length - 1) return;
    editingTemplatesHandlers.swap({ from: index, to: index + 1 });
    updateModification('orderChanged', true);
  };

  const renameTemplate = (index: number, newName: string) => {
    if (editingTemplates[index].original.label !== newName) {
      editingTemplatesHandlers.setItemProp(index, 'current', {
        ...editingTemplates[index].current,
        label: newName,
      });
      updateModification('renameCount', modifications.renameCount + 1);
    }
  };

  const deleteTemplate = (index: number) => {
    if (editingTemplates.length === 0) return;
    editingTemplatesHandlers.remove(index);
    updateModification('deleteCount', modifications.deleteCount + 1);
  };

  const updateTemplateTags = (index: number, tags: string[]) => {
    if (editingTemplates[index].original.tags !== tags) {
      editingTemplatesHandlers.setItemProp(index, 'current', {
        ...editingTemplates[index].current,
        tags: tags,
      });
      updateModification('tagUpdateCount', modifications.tagUpdateCount + 1);
    }
  };

  const saveChanges = () => {
    setSavedTemplates(editingTemplates.map(template => template.current));
    resetModifications();
  };

  const discardChanges = () => {
    resetTemplateList();
  };

  const resetModifications = () => {
    setModifications({
      orderChanged: false,
      deleteCount: 0,
      renameCount: 0,
      tagUpdateCount: 0,
    });
  };

  return {
    editingTemplates: editingTemplates.map(template => template.current),
    modifications,
    hasModifications,
    moveTemplateUp,
    moveTemplateDown,
    renameTemplate,
    deleteTemplate,
    updateTemplateTags,
    discardChanges,
    saveChanges,
  };
};
