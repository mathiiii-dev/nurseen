import {privateRoute} from "../../../../../../../components/privateRoute";
import {useEffect, useState} from 'react';
import {Button, Space, Spoiler, Table, Text, Title} from "@mantine/core";
import {useRouter} from 'next/router'
import dayjs from "dayjs";
import 'dayjs/locale/fr';
import utc from "dayjs/plugin/utc";
import Link from 'next/link'

function KidNotes({auth}) {
    const router = useRouter();
    const [data, setData] = useState(null);
    const [notes, setNotes] = useState(null);

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
                <td>{dayjs(element.data).utc().format('DD MMMM YYYY')}</td>
                <td>
                    <Spoiler maxHeight={120} showLabel="Show more" hideLabel="Hide">
                        {
                            <Text dangerouslySetInnerHTML={{__html: element.note}}/>
                        }
                    </Spoiler>
                </td>
                <td>
                    <Link href={{
                        pathname: `/dashboard/family/[id]/kid/[pid]/note/${element.id}`,
                        query: {id: auth.decodedToken.id, pid: router.query.id}
                    }}>
                        <Button>Note</Button>
                    </Link>
                </td>
            </tr>
        ));
    }

    return (
        <>
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
                    <th>Voir</th>
                </tr>
                </thead>
                <tbody>{rows}</tbody>
            </Table>
        </>
    );
}

export default privateRoute(KidNotes);