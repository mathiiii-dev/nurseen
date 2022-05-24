import { Button, Center, Space, Text, Title } from '@mantine/core';
import Link from 'next/link';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';

function Menu({ menu, role }) {
    return (
        <div>
            <Link href={'menu/list'}>
                <Button>Voir la liste des anciens menus</Button>
            </Link>
            {menu ? (
                <>
                    <Center>
                        <Title order={1}>
                            Menu du{' '}
                            {dayjs(menu.date)
                                .add(1, 'day')
                                .locale('fr')
                                .format('DD MMMM YYYY')}
                        </Title>
                    </Center>

                    <Space h={'xl'} />

                    <Center>
                        <Title order={2}>Entrée</Title>
                    </Center>
                    <Center>
                        <Text>{menu.entry}</Text>
                    </Center>

                    <Space h={'xl'} />

                    <Center>
                        <Title order={2}>Entrée</Title>
                    </Center>
                    <Center>
                        <Text>{menu.entry}</Text>
                    </Center>

                    <Space h={'xl'} />

                    <Center>
                        <Title order={2}>Plat</Title>
                    </Center>
                    <Center>
                        <Text>{menu.meal}</Text>
                    </Center>

                    <Space h={'xl'} />

                    <Center>
                        <Title order={2}>Dessert</Title>
                    </Center>
                    <Center>
                        <Text>{menu.dessert}</Text>
                    </Center>
                </>
            ) : (
                <>
                    {role === 'ROLE_PARENT' ? (
                        <>
                            <Text>
                                Le menu du jour n'as pas encore été renseigné
                            </Text>
                        </>
                    ) : (
                        <>
                            <Text>
                                Le menu du jour n'as pas encore été renseigné
                            </Text>
                            <Link href="menu/add">
                                <Button>Reiseigner le ici</Button>
                            </Link>
                        </>
                    )}
                </>
            )}
        </div>
    );
}

export default Menu;
