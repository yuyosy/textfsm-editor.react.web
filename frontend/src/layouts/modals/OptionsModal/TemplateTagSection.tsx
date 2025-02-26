import { useState } from 'react';

import {
  Accordion,
  ActionIcon,
  Badge,
  Button,
  ColorInput,
  Divider,
  Flex,
  Grid,
  Group,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useAtom } from 'jotai';
import { ArrowDown, ArrowUp, Plus, RefreshCw } from 'lucide-react';

import { TagBadge } from '@/components/TagBadege';
import { templateTagsAtom } from '@/features/state/storageAtoms';
import { colors } from '@/utils/colors';

import { TemplateTag } from '../types';

const getRandomColor = () => {
  return colors[Math.floor(Math.random() * colors.length)];
};

export const TemplateTagSection = () => {
  const [tags, setTags] = useAtom(templateTagsAtom);
  const [newTagName, setNewTagName] = useState('');
  const [newTagDescription, setNewTagDescription] = useState('');
  const [newTagColor, setNewTagColor] = useState(getRandomColor());
  const [accordionSection, setAccordionSection] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [editingTag, setEditingTag] = useState<TemplateTag | null>(null);
  const [originalTag, setOriginalTag] = useState<TemplateTag | null>(null);
  const [editingTagName, setEditingTagName] = useState('');
  const [editingTagDescription, setEditingTagDescription] = useState('');
  const [editingTagColor, setEditingTagColor] = useState(getRandomColor());

  const addTag = () => {
    if (tags.some(tag => tag.name === newTagName)) {
      setError('Tag name already exists');
      return;
    }

    const newTag: TemplateTag = {
      name: newTagName,
      description: newTagDescription || '',
      color: newTagColor,
    };
    setTags([...tags, newTag]);
    resetNewTagInputs();
  };

  const updateTag = (updatedTag: TemplateTag) => {
    if (!originalTag) {
      return;
    }
    const updatedTags = tags.map(tag =>
      tag.name === originalTag.name ? updatedTag : tag
    );
    setTags(updatedTags);
    resetEditingState();
  };

  const deleteTag = (name: string) => {
    const updatedTags = tags.filter(tag => tag.name !== name);
    setTags(updatedTags);
  };

  const swapTag = (tag: TemplateTag, to: number) => {
    const cloned = [...tags];
    const from = cloned.findIndex(item => item.name === tag.name);
    if (from < 0) {
      return;
    }
    const fromItem = cloned[from];
    const toItem = cloned[to];
    cloned.splice(to, 1, fromItem);
    cloned.splice(from, 1, toItem);
    setTags(cloned);
  };

  const startEditing = (tag: TemplateTag) => {
    setEditingTag(tag);
    setOriginalTag(tag);
    setEditingTagName(tag.name);
    setEditingTagDescription(tag.description || '');
    setEditingTagColor(tag.color || getRandomColor());
  };

  const discardChanges = () => {
    if (originalTag) {
      setEditingTagName(originalTag.name);
      setEditingTagDescription(originalTag.description || '');
      setEditingTagColor(originalTag.color || getRandomColor());
    }
    resetEditingState();
  };

  const handleOnChangeAccordionSection = (value: string | null) => {
    if (value !== '$acttion:new' && value) {
      startEditing(tags[tags.findIndex(tag => tag.name === value)]);
    }
    setAccordionSection(value);
  };

  const resetNewTagInputs = () => {
    setNewTagName('');
    setNewTagDescription('');
    setNewTagColor(getRandomColor());
    setError('');
  };

  const resetEditingState = () => {
    setEditingTag(null);
    setOriginalTag(null);
    setError('');
  };

  return (
    <Stack>
      <Accordion
        variant="separated"
        value={accordionSection}
        onChange={handleOnChangeAccordionSection}
      >
        <Accordion.Item key="$acttion:new" value="$acttion:new">
          <Accordion.Control icon={<Plus />}>New Tag</Accordion.Control>
          <Accordion.Panel>
            <Stack gap={16}>
              <SimpleGrid cols={2} spacing={8} verticalSpacing={8}>
                <TextInput
                  value={newTagName}
                  onChange={e => setNewTagName(e.currentTarget.value)}
                  label="Tag name"
                  placeholder="Tag name"
                  required
                  error={error}
                />
                <TextInput
                  value={newTagDescription}
                  onChange={e => setNewTagDescription(e.currentTarget.value)}
                  label="Tag description"
                  placeholder="Tag description"
                />
                <ColorInput
                  label="Background"
                  format="hex"
                  swatches={colors}
                  swatchesPerRow={8}
                  size="xs"
                  withEyeDropper={true}
                  value={newTagColor}
                  onChange={setNewTagColor}
                  rightSection={
                    <ActionIcon
                      variant="transparent"
                      color="gray"
                      onClick={() => setNewTagColor(getRandomColor())}
                    >
                      <RefreshCw size={16} />
                    </ActionIcon>
                  }
                />
                <Flex align="center" pt={24}>
                  <Badge color={newTagColor} variant="filled" tt="unset" autoContrast>
                    {newTagName === '' ? 'tag name here' : newTagName}
                  </Badge>
                </Flex>
              </SimpleGrid>
              <Button
                size="xs"
                variant="outline"
                onClick={addTag}
                disabled={newTagName == '' ? true : false}
              >
                Add Tag
              </Button>
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>
        {tags.map((tag, index) => (
          <Accordion.Item key={tag.name} value={tag.name}>
            <Accordion.Control>
              <Grid align="center">
                <Grid.Col span="content">
                  <TagBadge name={tag.name} color={tag.color} />
                </Grid.Col>
                <Grid.Col span="content">
                  <Text size="xs" c="dimmed">
                    {tag.description}
                  </Text>
                </Grid.Col>
              </Grid>
            </Accordion.Control>
            <Accordion.Panel>
              <Stack>
                <SimpleGrid cols={2} spacing={8} verticalSpacing={8}>
                  <TextInput
                    value={editingTag?.name === tag.name ? editingTagName : tag.name}
                    onChange={e => setEditingTagName(e.currentTarget.value)}
                    label="Tag name"
                    placeholder="Tag name"
                    required
                    error={error}
                  />
                  <TextInput
                    value={
                      editingTag?.name === tag.name
                        ? editingTagDescription
                        : tag.description
                    }
                    onChange={e => setEditingTagDescription(e.currentTarget.value)}
                    label="Tag description"
                    placeholder="Tag description"
                  />
                  <ColorInput
                    label="Background"
                    format="hex"
                    swatches={colors}
                    swatchesPerRow={8}
                    size="xs"
                    value={editingTag?.name === tag.name ? editingTagColor : tag.color}
                    onChange={setEditingTagColor}
                  />
                </SimpleGrid>
                <Group gap="sm" justify="space-between">
                  <Flex justify="center" align="center" gap={4}>
                    <ActionIcon
                      variant="transparent"
                      color="green"
                      disabled={index === 0}
                      onClick={() => swapTag(tag, index - 1)}
                    >
                      <ArrowUp size={18} />
                    </ActionIcon>
                    <ActionIcon
                      variant="transparent"
                      color="green"
                      disabled={index === tags.length - 1}
                      onClick={() => swapTag(tag, index + 1)}
                    >
                      <ArrowDown size={18} />
                    </ActionIcon>
                  </Flex>
                  <Group>
                    <Button
                      size="compact-xs"
                      variant="filled"
                      color="red"
                      onClick={() => deleteTag(tag.name)}
                    >
                      Delete
                    </Button>
                    <Divider orientation="vertical" />
                    <Button
                      size="compact-xs"
                      variant="filled"
                      color="gray"
                      onClick={discardChanges}
                    >
                      Discard
                    </Button>
                    <Button
                      size="compact-xs"
                      variant="filled"
                      onClick={() =>
                        updateTag({
                          ...tag,
                          name: editingTagName,
                          description: editingTagDescription,
                          color: editingTagColor,
                        })
                      }
                    >
                      Save
                    </Button>
                  </Group>
                </Group>
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    </Stack>
  );
};
