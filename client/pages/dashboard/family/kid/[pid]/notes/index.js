import { Button, Space, Spoiler, Table, Text, Title } from '@mantine/core';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import utc from 'dayjs/plugin/utc';
import Link from 'next/link';
import { getSession } from 'next-auth/react';
import { AuthToken } from '../../../../../../services/auth_token';

function KidNotes({ kid, notes }) {
    const router = useRouter();

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
                    <Link
                        href={`/dashboard/family/kid/${router.query.pid}/notes/${element.id}`}
                    >
                        <Button>Note</Button>
                    </Link>
                </td>
            </tr>
        ));
    }

    return (
        <>
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
                        <th>Voir</th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </Table>
        </>
    );
}

export default KidNotes;

export async function getServerSideProps(ctx) {
    const sessionCallBack = await getSession(ctx);

    const authToken = new AuthToken(sessionCallBack.user.access_token);

    const res = await fetch(process.env.BASE_URL + `kid/${ctx.params.pid}`, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
            Authorization: authToken.authorizationString,
        },
    });
    const kid = await res.json();

    const res1 = await fetch(
        process.env.BASE_URL + `note/kid/${ctx.params.pid}/all`,
        {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                Authorization: authToken.authorizationString,
            },
        }
    );

    const notes = await res1.json();

    return {
        props: {
            kid,
            notes,
        },
    };
}
