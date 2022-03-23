import {privateRoute} from "../../../../../components/privateRoute";
import {Button, Table, Modal, Alert, Space} from "@mantine/core";
import {useEffect, useState} from "react";
import dayjs from "dayjs";
import 'dayjs/locale/fr';
import utc from 'dayjs/plugin/utc'
import {useRouter} from 'next/router'
import Link from 'next/link'

function FamilyKidList({auth}) {
    const router = useRouter()
    const [data, setData] = useState(null);
    const [opened, setOpened] = useState(false);
    const [kidId, setKidId] = useState(false);
    let rows = null;
    dayjs.locale('fr')
    dayjs.extend(utc)
    dayjs.utc().format()
    useEffect(() => {
        fetch(`http://localhost:8010/proxy/api/kid/family/${auth.decodedToken.id}`,
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

    if (data) {
        rows = data.map((element) => (
            <tr key={element.id}>
                <td>{element.firstname}</td>
                <td>{element.lastname}</td>
                <td>{dayjs(element.birthday).utc().format('DD MMMM YYYY')}</td>
                <td>
                    <Link href={{
                        pathname: `/dashboard/family/[id]/kid/[pid]/notes`,
                        query: {id: auth.decodedToken.id, pid: element.id}
                    }}>
                        <Button>Note</Button>
                    </Link>
                </td>
            </tr>
        ));
    }

    return (
        <>
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
                    <th>Notes</th>
                </tr>
                </thead>
                <tbody>{rows}</tbody>
            </Table>
        </>
    )
}

export default privateRoute(FamilyKidList);