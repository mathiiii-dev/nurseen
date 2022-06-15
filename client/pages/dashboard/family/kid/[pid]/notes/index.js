import {Button, Center, Image, SimpleGrid, Space, Table, Text, Title} from '@mantine/core';
import {useRouter} from 'next/router';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import Link from 'next/link';
import {getSession} from 'next-auth/react';
import {AuthToken} from '../../../../../../services/auth_token';
import React from "react";

function KidNotes({kid, notes}) {
    const router = useRouter();

    let rows = null;
    if (notes.length > 0) {
        rows = notes.map((element) => (
            <tr key={element.id} className="tr">
                <td data-label="Date" className="td">{dayjs(element.data).format('DD MMMM YYYY')}</td>
                <td data-label="Note" className="td">
                    <Text
                        dangerouslySetInnerHTML={{
                            __html: element.note.substring(0, 100) + '...'
                        }}
                    />
                </td>
                <td className="td" data-label="Voir la note">
                    <Link
                        href={`/dashboard/family/kid/${router.query.pid}/notes/${element.id}`}
                    >
                        <Button>Voir la note</Button>
                    </Link>
                </td>
            </tr>
        ));
    }

    return (
        <>
            {kid ? <Title>Les notes de {kid.firstname} </Title> : ''}
            {
                notes.length > 0 ? (
                    <>
                        <Space h="xl"/>
                        <table className="table">
                            <thead className="thead">
                            <tr className="tr">
                                <th scope="col" className="th">Date</th>
                                <th scope="col" className="th">Note</th>
                                <th scope="col" className="th">Voir</th>
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
                    </SimpleGrid>
                )
            }

        </>
    );
}

export default KidNotes;

export async function getServerSideProps(ctx) {
    const sessionCallBack = await getSession(ctx);

    const authToken = new AuthToken(sessionCallBack.user.access_token);

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}kid/${ctx.params.pid}`,
        {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                Authorization: authToken.authorizationString,
            },
        }
    );
    const kid = await res.json();

    if (kid.error) {
        return {
            notFound: true,
        };
    }

    const res1 = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}note/kid/${ctx.params.pid}/all`,
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
