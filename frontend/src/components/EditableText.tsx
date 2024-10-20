import { Text, TextInput } from '@mantine/core';
import { useState } from 'react';

interface EditableTextProps {
  text: string;
  setText: (newText: string) => void;
}

export const EditableText = ({ text, setText }: EditableTextProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newText, setNewText] = useState<string>(text);

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    setNewText(text);
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setIsEditing(false);
      setText(newText);
      setNewText(text);
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
        />
      ) : (
        <Text onClick={handleClick}>{text}</Text>
      )}
    </>
  );
};
