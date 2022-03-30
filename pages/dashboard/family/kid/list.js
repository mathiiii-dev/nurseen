import {Button, Table} from "@mantine/core";
import {useEffect, useState} from "react";
import dayjs from "dayjs";
import 'dayjs/locale/fr';
import utc from 'dayjs/plugin/utc'
import Link from 'next/link'
import {getServerSideProps} from "../index";

function FamilyKidList({userId, bearer}) {
    const [data, setData] = useState(null);
    let rows = null;
    dayjs.locale('fr')
    dayjs.extend(utc)
    dayjs.utc().format()
    useEffect(() => {
        fetch(`http://localhost:8010/proxy/api/kid/family/${userId}`,
            {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': bearer
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
                        pathname: `/dashboard/family/kid/[pid]/note`,
                        query: {pid: element.id}
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

export default FamilyKidList;

export {getServerSideProps};
