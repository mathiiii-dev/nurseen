import React, {useState} from 'react';
import {
    Button,
    Center,
    Grid,
    Image,
    Space,
    Text,
    Title,
    Group,
} from '@mantine/core';
import {useClickOutside} from "@mantine/hooks";

function Home() {
    const [nurse, setNurse] = useState(false);
    const [family, setFamily] = useState(false);
    const ref = useClickOutside(() => {
        setNurse(false);
        setFamily(false);
    });
    return (
        <>
            <Grid
                style={{
                    backgroundColor: '#f4fdfc',
                    padding: 50,
                    borderRadius: 11,
                }}
            >
                <Grid.Col md={6}>
                    <Center>
                        <Title style={{fontSize: 80}}>Nurseen</Title>
                    </Center>
                    <Space h={'xl'}/>
                    <Text align={"justify"}>
                        Ce projet est un projet personnel, me permettant de
                        découvrir Next.JS et donc React. Le but du projet est
                        d'aider les nourrices dans la vie de tous les jours et
                        facilité leur travail (Calendrier des enfants, Ajout de
                        note personnel etc..). Il y a aussi un côté pour les
                        parents, pour qu'ils puissent suivre leurs enfants
                        (Galerie photo, Fil d'actualité etc..).
                    </Text>
                    <Space h={'xl'}/>
                    <Text>Compte de test : </Text>
                    <Center>
                        <Group>
                            <Button
                                onClick={() => {
                                    setFamily(false);
                                    setNurse(true);
                                }}
                                style={{
                                    marginTop: 25,
                                    backgroundColor: '#4ad4c6',
                                }}
                                radius={'md'}
                                size={'md'}
                            >
                                Compte nourrice
                            </Button>
                            <Button
                                onClick={() => {
                                    setFamily(true);
                                    setNurse(false);
                                }}
                                style={{
                                    marginTop: 25,
                                    backgroundColor: '#4ad4c6',
                                }}
                                radius={'md'}
                                size={'md'}
                            >
                                Compte parent
                            </Button>
                        </Group>
                    </Center>
                    <Space h={'xl'}/>
                    <Center>
                        {nurse && (
                            <div ref={ref}>
                                <Text>Email : nurse@mail.com</Text>
                                <Text>Mot de passe : password</Text>
                            </div>
                        )}
                        {family && (
                            <div ref={ref}>
                                <Text>Email : family@mail.com</Text>
                                <Text>Mot de passe : password</Text>
                            </div>
                        )}
                    </Center>
                </Grid.Col>
                <Grid.Col md={6}>
                    <Image
                        radius="md"
                        src="/img/undraw_motherhood_re_pk2m.svg"
                        alt="Random unsplash image"
                    />
                </Grid.Col>
            </Grid>
        </>
    );
}

export default Home;
