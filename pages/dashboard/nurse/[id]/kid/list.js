import {privateRoute} from "../../../../../components/privateRoute";
import {Button, Table, Modal, Alert, Space} from "@mantine/core";
import {useEffect, useState} from "react";
import dayjs from "dayjs";
import 'dayjs/locale/fr';
import utc from 'dayjs/plugin/utc'
import {useRouter} from 'next/router'

function KidList({auth}) {
    const router = useRouter()
    const [data, setData] = useState(null);
    const [opened, setOpened] = useState(false);
    const [kidId, setKidId] = useState(false);
    let rows = null;
    dayjs.locale('fr')
    dayjs.extend(utc)
    dayjs.utc().format()
    useEffect(() => {
        fetch(`http://localhost:8010/proxy/api/kid/nurse/${auth.decodedToken.id}`,
            {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': auth.authorizationString
                }
            })
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
                setData(data)
            })
    }, [])

    const activate = (kidId) => {
        fetch(`http://localhost:8010/proxy/api/kid/${kidId}/activate`,
            {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': auth.authorizationString
                }
            }).then(r => {
            router.reload(window.location.pathname)
        })
    }

    const archived = () => {
        fetch(`http://localhost:8010/proxy/api/kid/${kidId}/archive`,
            {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': auth.authorizationString
                }
            }).then(r => {
            console.log(r.json())
            router.reload(window.location.pathname)
        })
    }

    if (data) {
        rows = data.map((element) => (
            <tr key={element.id}>
                <td>{element.firstname}</td>
                <td>{element.lastname}</td>
                <td>{dayjs(element.birthday).utc().format('DD MMMM YYYY')}</td>
                <td>
                    {
                        element.activated ?
                            <Button color="red" onClick={() => activate(element.id, false)}>Désactiver</Button>
                            :
                            <Button style={{backgroundColor: '#4ad4c6'}}
                                    onClick={() => activate(element.id, true)}>Activer</Button>
                    }
                </td>
                <td>
                    {
                        <Button color="red" onClick={() => {
                            setOpened(true)
                            setKidId(element.id)
                        }
                        }>
                            Archiver
                        </Button>
                    }
                </td>
                <td>
                    <Button>Note</Button>
                </td>
            </tr>
        ));
    }

    return (
        <>
            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                hideCloseButton
                centered
            >
                <Alert title="Attention !" color="red">
                    Êtes-vous sûr de vouloir archiver cette enfant ? <br/>
                    Il n'apparaitra plus dans cette liste
                </Alert>
                <Space h={"xl"}/>
                <Button
                    fullWidth
                    color="red"
                    onClick={() => archived()}
                >Archiver</Button>
            </Modal>
            <Table
                horizontalSpacing="xl"
                verticalSpacing="xl"
                style={{marginTop: 10}}
            >
                <thead>
                <tr>
                    <th>Prénom</th>
                    <th>Nom</th>
                    <th>Date d'anniversaire</th>
                    <th>Enfant actif</th>
                    <th>Archiver</th>
                    <th>Note du jour</th>
                </tr>
                </thead>
                <tbody>{rows}</tbody>
            </Table>
        </>
    )
}

export default privateRoute(KidList);