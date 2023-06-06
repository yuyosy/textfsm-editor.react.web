import { Anchor, Footer, Group, Text } from '@mantine/core'

export const AppFooter = () => {
    return (
        <>
            <Footer height={25} px={10}>
                <Group position='apart'>
                    <Group>
                    </Group>
                    <Group>
                        <Text size='sm' c='dimmed'>Made by yuyosy</Text>
                        <Anchor size='sm' href="https://github.com/yuyosy" target="_blank">
                            GitHub
                        </Anchor>
                    </Group>
                </Group>
            </Footer>
        </>
    )
}
