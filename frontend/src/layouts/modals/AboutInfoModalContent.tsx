import { MutableRefObject } from 'react';

import {
  Anchor,
  Button,
  Card,
  Flex,
  Group,
  Modal,
  Stack,
  Table,
  Text,
} from '@mantine/core';
import { SquareArrowOutUpRight } from 'lucide-react';

type ModalContentProps = {
  close: () => void;
  focusRef: MutableRefObject<HTMLDivElement>;
};
export const AboutInfoModalContent = ({ close, focusRef }: ModalContentProps) => {
  return (
    <Modal.Content>
      <Modal.Header>
        <Modal.Title fz={18} fw={700}>
          About
        </Modal.Title>
        <Modal.CloseButton />
      </Modal.Header>
      <Modal.Body>
        <Stack ref={focusRef}>
          <Text fw={500}>About TextFSM-Editor</Text>
          <Card radius="md" p={2} withBorder>
            <Table variant="vertical" layout="fixed">
              <Table.Tbody>
                <Table.Tr>
                  <Table.Th fw="normal" w={160}>
                    Version
                  </Table.Th>
                  <Table.Td>{__APP_VERSION__}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th fw="normal">Author</Table.Th>
                  <Table.Td>yuyosy</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th fw="normal">License</Table.Th>
                  <Table.Td>
                    <Anchor
                      href="https://github.com/yuyosy/textfsm-editor.react.web/blob/main/LICENSE"
                      target="_blank"
                      fz={14}
                    >
                      <Flex align="center" gap="sm">
                        MIT License
                        <SquareArrowOutUpRight size={16} />
                      </Flex>
                    </Anchor>
                  </Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </Card>
          <Text fw={500}>Related links</Text>
          <Card radius="md" p={2} withBorder>
            <Table variant="vertical" layout="fixed">
              <Table.Tbody>
                <Table.Tr>
                  <Table.Th fw="normal" w={160}>
                    Source code
                  </Table.Th>
                  <Table.Td>
                    <Anchor
                      href="https://github.com/yuyosy/textfsm-editor.react.web/"
                      target="_blank"
                      fz={14}
                    >
                      <Flex align="center" gap="sm">
                        GitHub
                        <SquareArrowOutUpRight size={16} />
                      </Flex>
                    </Anchor>
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th fw="normal" w={160}>
                    Releases
                  </Table.Th>
                  <Table.Td>
                    <Anchor
                      href="https://github.com/yuyosy/textfsm-editor.react.web/releases"
                      target="_blank"
                      fz={14}
                    >
                      <Flex align="center" gap="sm">
                        GitHub Releases
                        <SquareArrowOutUpRight size={16} />
                      </Flex>
                    </Anchor>
                  </Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </Card>
          <Text fw={500}>References</Text>
          <Card radius="md" p={2} withBorder>
            <Table variant="vertical" layout="fixed">
              <Table.Tbody>
                <Table.Tr>
                  <Table.Th fw="normal" w={160}>
                    TextFSM
                  </Table.Th>
                  <Table.Td>
                    <Anchor
                      href="https://github.com/google/textfsm"
                      target="_blank"
                      fz={14}
                    >
                      <Flex align="center" gap="sm">
                        GitHub - Google/textfsm
                        <SquareArrowOutUpRight size={16} />
                      </Flex>
                    </Anchor>
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th fw="normal">NTC Templates</Table.Th>
                  <Table.Td>
                    <Anchor
                      href="https://ntc-templates.readthedocs.io/en/latest/"
                      target="_blank"
                      fz={14}
                    >
                      <Flex align="center" gap="sm">
                        NTC Templates
                        <SquareArrowOutUpRight size={16} />
                      </Flex>
                    </Anchor>
                  </Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </Card>
        </Stack>
        <Group justify="space-between" mt="lg">
          <Button variant="default" size="xs" onClick={close}>
            Close
          </Button>
        </Group>
      </Modal.Body>
    </Modal.Content>
  );
};
