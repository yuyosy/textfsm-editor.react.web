import { Anchor, Card, Flex, Table, Text } from '@mantine/core';
import { SquareArrowOutUpRight } from 'lucide-react';

export const ReferencesSection = () => {
  return (
    <>
      <Text fw={500}>References</Text>
      <Card radius="md" p={2} withBorder>
        <Table variant="vertical" layout="fixed">
          <Table.Tbody>
            <Table.Tr>
              <Table.Th fw="normal" w={160}>
                TextFSM
              </Table.Th>
              <Table.Td>
                <Anchor href="https://github.com/google/textfsm" target="_blank" fz={14}>
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
    </>
  );
};
