import {Button, Center, Image, SimpleGrid, Space, Text, Title} from '@mantine/core';
import Link from 'next/link';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import React from "react";

function Menu({menu, role}) {
    return (
        <div>
            <Link href={'menu/list'}>
                <Button>Voir la liste des anciens menus</Button>
            </Link>
            <Space h={'xl'}/>
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
                    <Space h={'xl'}/>
                    <Center>
                        <Title order={2}>Entrée</Title>
                    </Center>
                    <Center>
                        <Text>{menu.entry}</Text>
                    </Center>
                    <Space h={'xl'}/>
                    <Center>
                        <Title order={2}>Entrée</Title>
                    </Center>
                    <Center>
                        <Text>{menu.entry}</Text>
                    </Center>
                    <Space h={'xl'}/>
                    <Center>
                        <Title order={2}>Plat</Title>
                    </Center>
                    <Center>
                        <Text>{menu.meal}</Text>
                    </Center>
                    <Space h={'xl'}/>
                    <Center>
                        <Title order={2}>Dessert</Title>
                    </Center>
                    <Center>
                        <Text>{menu.dessert}</Text>
                    </Center>
                </>
            ) : (
                <>
                    <SimpleGrid cols={1}>
                        <Center>
                            <Space h={"xl"}/>
                            <div style={{width: 380, marginLeft: 'auto', marginRight: 'auto'}}>
                                <Image
                                    radius="md"
                                    src="/img/undraw_empty_re_opql.svg"
                                    alt="Random unsplash image"
                                />
                            </div>
                        </Center>
                        <Center>
                            <Text>
                                Le menu du jour n'a pas encore été renseigné
                            </Text>
                        </Center>
                        {role === 'ROLE_NURSE' && (
                            <>
                                <Center>
                                    <Link href="menu/add">
                                        <Button>Reiseigner le ici</Button>
                                    </Link>
                                </Center>
                            </>
                        )}
                    </SimpleGrid>
                </>
            )}
        </div>
    );
}

export default Menu;
