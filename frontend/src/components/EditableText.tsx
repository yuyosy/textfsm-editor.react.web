import { useState } from 'react';

import { Text, TextInput } from '@mantine/core';

interface EditableTextProps {
  text: string;
  setText: (newText: string) => void;
}

export const EditableText = ({ text, setText }: EditableTextProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newText, setNewText] = useState<string>(text);

  const confirmText = () => {
    setText(newText);
    setNewText(text);
    setIsEditing(false);
  };

  const resetText = () => {
    setIsEditing(false);
    setNewText(text);
  };

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    confirmText();
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      confirmText();
    } else if (event.key === 'Escape') {
      resetText();
    }
  };

  return (
    <>
      {isEditing ? (
        <TextInput
          value={newText}
          onChange={event => setNewText(event.currentTarget.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          styles={{ input: { height: 28, minHeight: 28, fontSize: 16, padding: 2 } }}
        />
      ) : (
        <Text onClick={handleClick} px={3}>
          {text}
        </Text>
      )}
    </>
  );
};
