import { useState } from 'react';
import RichTextEditor from '../../../../../../components/rte';
import {
    Alert,
    Button,
    Modal,
    Space,
    Spoiler,
    Table,
    Text,
    Title,
    Drawer,
} from '@mantine/core';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import utc from 'dayjs/plugin/utc';
import { getSession } from 'next-auth/react';
import { AuthToken } from '../../../../../../services/auth_token';

function NoteList({ bearer, kid, notes }) {
    const [opened, setOpened] = useState(false);
    const [openedDrawer, setOpenedDrawer] = useState(false);
    const router = useRouter();
    const [value, onChange] = useState('');
    const [noteId, setNoteId] = useState(null);

    dayjs.locale('fr');
    dayjs.extend(utc);
    dayjs.utc().format();

    let rows = null;
    if (notes) {
        rows = notes.map((element) => (
            <tr key={element.id}>
                <td>{dayjs(element.data).utc().format('DD MMMM YYYY')}</td>
                <td>
                    <Spoiler
                        maxHeight={120}
                        showLabel="Show more"
                        hideLabel="Hide"
                    >
                        {
                            <Text
                                dangerouslySetInnerHTML={{
                                    __html: element.note,
                                }}
                            />
                        }
                    </Spoiler>
                </td>
                <td>
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
                <td>
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
        fetch(`${process.env.BASE_URL}note/${noteId}`, {
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
        await fetch(`${process.env.BASE_URL}note/${noteId}/edit`, {
            method: 'PATCH',
            body: JSON.stringify({
                note: value,
            }),
            headers: {
                'Content-type': 'application/json',
                Authorization: bearer,
            },
        });
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
                    <Space h={'xl'} />
                    <Button
                        type="submit"
                        size={'lg'}
                        style={{ backgroundColor: '#4ad4c6', float: 'right' }}
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
                    Êtes-vous sûr de vouloir supprimer cette note ? <br />
                    Elle n'apparaitra plus dans cette liste
                </Alert>
                <Space h={'xl'} />
                <Button fullWidth color="red" onClick={() => deleteNote()}>
                    Supprimer
                </Button>
            </Modal>
            <Space h="xl" />
            {kid ? <Title>Les notes de {kid.firstname} </Title> : ''}
            <Space h="xl" />
            <Table
                horizontalSpacing="xl"
                verticalSpacing="xl"
                style={{ marginTop: 10 }}
            >
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Note</th>
                        <th>Modifier</th>
                        <th>Supprimer</th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </Table>
        </>
    );
}

export default NoteList;

export async function getServerSideProps(ctx) {
    const sessionCallBack = await getSession(ctx);

    const authToken = new AuthToken(sessionCallBack.user.access_token);

    const res1 = await fetch(`${process.env.BASE_URL}kid/${ctx.params.pid}`, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
            Authorization: authToken.authorizationString,
        },
    });
    const kid = await res1.json();

    if (kid.error) {
        return {
            notFound: true,
        };
    }

    const res2 = await fetch(
        `${process.env.BASE_URL}note/kid/${ctx.params.pid}/all`,
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
