import React, {useState} from 'react';
import RichTextEditor from '../../../../../../components/rte';
import {
    Alert,
    Button,
    Modal,
    Space,
    Table,
    Text,
    Title,
    Drawer, SimpleGrid, Center, Image,
} from '@mantine/core';
import {useRouter} from 'next/router';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import utc from 'dayjs/plugin/utc';
import {getSession} from 'next-auth/react';
import {AuthToken} from '../../../../../../services/auth_token';
import Link from "next/link";

function NoteList({bearer, kid, notes}) {
    const [opened, setOpened] = useState(false);
    const [openedDrawer, setOpenedDrawer] = useState(false);
    const router = useRouter();
    const [value, onChange] = useState('');
    const [noteId, setNoteId] = useState(null);

    dayjs.locale('fr');
    dayjs.extend(utc);
    dayjs.utc().format();

    let rows = null;
    if (notes.length > 0) {
        rows = notes.map((element) => (
            <tr key={element.id} className="tr">
                <td className="td" data-label="Date">{dayjs(element.data).utc().format('DD MMMM YYYY')}</td>
                <td className="td" data-label="Note">
                    <Text
                        dangerouslySetInnerHTML={{
                            __html: element.note.substring(0,80) + '...'
                        }}
                    />

                </td>
                <td className="td" data-label="Modifier">
                    <Button
                        onClick={() => {
                            setOpenedDrawer(true);
                            onChange(element.note);
                            setNoteId(element.id);
                        }}
                    >
                        Modifier
                    </Button>
                </td>
                <td className="td" data-label="Supprimer">
                    <Button
                        color="red"
                        onClick={() => {
                            setOpened(true);
                            setNoteId(element.id);
                        }}
                    >
                        Supprimer
                    </Button>
                </td>
            </tr>
        ));
    }

    const deleteNote = () => {
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}note/${noteId}`, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json',
                Authorization: bearer,
            },
        }).then((r) => {
            if (r.status === 204) {
                setOpened(false);
                router.reload();
            }
        });
    };

    const edit = async () => {
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}note/${noteId}/edit`, {
            method: 'PATCH',
            body: JSON.stringify({
                note: value,
            }),
            headers: {
                'Content-type': 'application/json',
                Authorization: bearer,
            },
        })
    };

    return (
        <>
            <Drawer
                opened={openedDrawer}
                onClose={() => setOpenedDrawer(false)}
                title="Modifier une note"
                padding="xl"
                size="xl"
            >
                <form onSubmit={edit}>
                    <RichTextEditor
                        placeholder="Résumer en quelques phrases la journée d'un enfant"
                        value={value}
                        onChange={onChange}
                    />
                    <Space h={'xl'}/>
                    <Button
                        type="submit"
                        size={'lg'}
                        style={{backgroundColor: '#4ad4c6', float: 'right'}}
                    >
                        Modifier
                    </Button>
                </form>
            </Drawer>
            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                hideCloseButton
                centered
            >
                <Alert title="Attention !" color="red">
                    Êtes-vous sûr de vouloir supprimer cette note ? <br/>
                    Elle n'apparaitra plus dans cette liste
                </Alert>
                <Space h={'xl'}/>
                <Button fullWidth color="red" onClick={() => deleteNote()}>
                    Supprimer
                </Button>
            </Modal>
            <Space h="xl"/>
            <Space h="xl"/>
            {kid ? <Title>Les notes de {kid.firstname} </Title> : ''}
            {
                notes.length > 0 ? (
                    <>
                        <table className="table">
                            <thead className="thead">
                            <tr className="tr">
                                <th className="th" scope="col">Date</th>
                                <th className="th" scope="col">Note</th>
                                <th className="th" scope="col">Modifier</th>
                                <th className="th" scope="col">Supprimer</th>
                            </tr>
                            </thead>
                            <tbody className="tbody">{rows}</tbody>
                        </table>
                    </>
                ) : (
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
                            <Text>Cet enfant ne possède aucune note</Text>
                        </Center>
                        <Center>
                            <Link href="../../../../dashboard/nurse/note">
                                <Button>Ajouter une note</Button>
                            </Link>
                        </Center>
                    </SimpleGrid>
                )
            }
        </>
    );
}

export default NoteList;

export async function getServerSideProps(ctx) {
    const sessionCallBack = await getSession(ctx);

    const authToken = new AuthToken(sessionCallBack.user.access_token);

    const res1 = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}kid/${ctx.params.pid}`,
        {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                Authorization: authToken.authorizationString,
            },
        }
    );
    const kid = await res1.json();

    if (kid.error) {
        return {
            notFound: true,
        };
    }

    const res2 = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}note/kid/${ctx.params.pid}/all`,
        {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                Authorization: authToken.authorizationString,
            },
        }
    );

    const notes = await res2.json();

    return {
        props: {
            userId: sessionCallBack.user.id,
            bearer: authToken.authorizationString,
            kid,
            notes,
        },
    };
}
