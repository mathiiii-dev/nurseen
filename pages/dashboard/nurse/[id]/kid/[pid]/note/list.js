import {privateRoute} from "../../../../../../../components/privateRoute";
import {useEffect, useState} from 'react';
import RichTextEditor from '../../../../../../../components/rte';
import {Alert, Button, Modal, Space, Spoiler, Table, Text, Title, Drawer} from "@mantine/core";
import {useRouter} from 'next/router'
import dayjs from "dayjs";
import 'dayjs/locale/fr';
import utc from "dayjs/plugin/utc";


function NoteList({auth}) {
    const [opened, setOpened] = useState(false)
    const [openedDrawer, setOpenedDrawer] = useState(false)
    const router = useRouter();
    const [data, setData] = useState(null);
    const [value, onChange] = useState('');
    const [notes, setNotes] = useState(null);
    const [noteId, setNoteId] = useState(null);

    dayjs.locale('fr')
    dayjs.extend(utc)
    dayjs.utc().format()

    useEffect(() => {
        fetch(`http://localhost:8010/proxy/api/kid/${router.query.pid}`,
            {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': auth.authorizationString
                }
            })
            .then((res) => res.json())
            .then((data) => {
                setData(data)
            })
        fetch(`http://localhost:8010/proxy/api/note/kid/${router.query.pid}/all`,
            {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': auth.authorizationString
                }
            })
            .then((res) => res.json())
            .then((data) => {
                setNotes(data)
            })
    }, [])

    let rows = null;
    if (notes) {
        rows = notes.map((element) => (
            <tr key={element.id}>
                <td >{dayjs(element.data).utc().format('DD MMMM YYYY')}</td>
                <td >
                    <Spoiler maxHeight={120} showLabel="Show more" hideLabel="Hide">
                        {
                            <Text dangerouslySetInnerHTML={{__html: element.note}}/>
                        }
                    </Spoiler>
                </td>
                <td>
                    <Button onClick={
                        () => {
                            setOpenedDrawer(true)
                            onChange(element.note)
                            setNoteId(element.id)
                        }
                    }>Modifier</Button>
                </td>
                <td>
                    <Button color="red" onClick={() => {
                        setOpened(true)
                        setNoteId(element.id)
                    }}>Supprimer</Button>
                </td>
            </tr>
        ));
    }

    const deleteNote = () => {
        fetch(`http://localhost:8010/proxy/api/note/${noteId}`,
            {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': auth.authorizationString
                }
            }).then(r => {
            router.reload()
        })
    }

    const edit = () => {
        fetch(`http://localhost:8010/proxy/api/note/${noteId}/edit`,
            {
                method: 'PATCH',
                body:JSON.stringify({
                    note: value
                }),
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': auth.authorizationString
                }
            }).then(r => {
            router.reload()
        })
    }

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
                        onChange={onChange}/>
                    <Space h={"xl"}/>
                    <Button type="submit" size={"lg"}
                            style={{backgroundColor: '#4ad4c6', float: 'right'}}>Modifier</Button>
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
                <Space h={"xl"}/>
                <Button
                    fullWidth
                    color="red"
                    onClick={() => deleteNote()}
                >Supprimer</Button>
            </Modal>
            <Space h="xl"/>
            {
                data ?
                    <Title>Les notes de {data.firstname} </Title>
                    : ''
            }
            <Space h="xl"/>
            <Table
                horizontalSpacing="xl"
                verticalSpacing="xl"
                style={{marginTop: 10}}
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

export default privateRoute(NoteList);