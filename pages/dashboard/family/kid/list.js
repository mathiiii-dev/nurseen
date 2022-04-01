import {Button, Table} from "@mantine/core";
import dayjs from "dayjs";
import 'dayjs/locale/fr';
import utc from 'dayjs/plugin/utc'
import Link from 'next/link';
import {getSession} from "next-auth/react";
import {AuthToken} from "../../../../services/auth_token";

function FamilyKidList({kids}) {
    let rows = null;
    dayjs.locale('fr')
    dayjs.extend(utc)
    dayjs.utc().format()

    if (kids) {
        rows = kids.map((element) => (
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

export async function getServerSideProps(ctx) {
    const sessionCallBack = await getSession(ctx);

    const authToken = new AuthToken(sessionCallBack.user.access_token);

    const res = await fetch(`http://localhost:8010/proxy/api/kid/family/${authToken.decodedToken.id}`,
        {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': authToken.authorizationString
            }
        });
    const kids = await res.json()

    return {
        props: {
            kids
        }
    }
}
