import { getSession } from 'next-auth/react';
import {
    Button,
    Center,
    Grid,
    Pagination,
    Space,
    Text,
    Title,
    LoadingOverlay,
} from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
import { AuthToken } from '../../../services/auth_token';
import Link from 'next/link';
import '../../../styles/globals.css';
import DashboardCard from '../../../components/DashboardCard';
import { familyCards } from '../../../data/cards';
import { usePagination } from '@mantine/hooks';
import Chat from '../../../components/Chat';
import { scrollToBottom } from '../../../services/scroll';
import EventSource from 'eventsource';
import dayjs from 'dayjs';

export default function Page({
    bearer,
    userId,
    messages,
    chat,
    firstname,
    lastname,
}) {
    const [kids, setKids] = useState();
    const [page, onChange] = useState(1);
    const [total, setTotal] = useState(1);
    const pagination = usePagination({ total, page, onChange });
    const [visible, setVisible] = useState(false);
    const viewport = useRef();

    const open = (event) => {
        event.preventDefault();
        fetch(process.env.BASE_URL + `chat/family`, {
            method: 'POST',
            body: JSON.stringify({
                family: userId,
            }),
            headers: {
                'Content-type': 'application/json',
                Authorization: bearer,
            },
        }).then((r) => {
            console.log(r);
        });
    };
    const [stateMessages, setStateMessages] = useState(messages);
    if (chat) {
        useEffect(() => {
            scrollToBottom(viewport);
            const url = new URL('http://localhost:9090/.well-known/mercure');
            url.searchParams.append(
                'topic',
                `http://localhost:8010/proxy/api/message/${chat[0].id}`
            );
            const eventSource = new EventSource(url.toString());
            eventSource.onmessage = (e) => {
                let origin = JSON.parse(e.data);
                console.log(userId, origin.userId);
                console.log(stateMessages);
                setStateMessages((state) => [
                    ...state,
                    {
                        id: origin.id,
                        message: origin.data,
                        user: {
                            id: origin.userId,
                            firstname: origin.firstname,
                            lastname: origin.lastname,
                        },
                        sendDate: dayjs().toString(),
                    },
                ]);

                scrollToBottom(viewport);
            };
        }, []);
    }

    useEffect(() => {
        setVisible(true);
        fetch(`${process.env.BASE_URL}kid/family/${userId}?page=${page}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                Authorization: bearer,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setKids(data.items);
                setTotal(data.pagination.total_pages);
                setVisible(false);
            });
    }, [page]);

    return (
        <>
            <Grid>
                <Grid.Col>
                    <Title>{`Bonjour, ${firstname} ${lastname} !`}</Title>
                </Grid.Col>
                <Grid.Col>
                    <Link href={'family/create-kid'}>
                        <Button>Ajouter un enfant</Button>
                    </Link>
                </Grid.Col>
            </Grid>

            <Space h={'xl'} />
            <Grid>
                {familyCards &&
                    Object.values(familyCards).map((card, id) => {
                        return (
                            <Grid.Col md={3} key={id}>
                                <DashboardCard
                                    title={card.title}
                                    buttonText={card.buttonText}
                                    text={card.text}
                                    linkHref={card.linkHref}
                                />
                            </Grid.Col>
                        );
                    })}
            </Grid>
            <Space h={'xl'} />
            <Grid gutter="xl">
                <Grid.Col md={6}>
                    <LoadingOverlay visible={visible} />
                    <table>
                        <thead>
                            <tr>
                                <th scope="col">
                                    <Text>Nom</Text>
                                </th>
                                <th scope="col">
                                    <Text>Prénom</Text>
                                </th>
                                <th scope="col">
                                    <Text>Note</Text>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {kids &&
                                kids.map((kid) => {
                                    return (
                                        <tr>
                                            <td data-label="Nom">
                                                <Text>{kid.lastname}</Text>
                                            </td>
                                            <td data-label="Prénom">
                                                <Text>{kid.firstname}</Text>
                                            </td>
                                            <td data-label="Note">
                                                <Link
                                                    href={{
                                                        pathname: `/dashboard/family/kid/[pid]/notes`,
                                                        query: { pid: kid.id },
                                                    }}
                                                >
                                                    <Button>Note</Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                    <Space h={'xl'} />
                    <Center>
                        <Pagination total={total} onChange={onChange} />
                    </Center>
                </Grid.Col>
                <Grid.Col md={6}>
                    {chat != null ? (
                        <Chat
                            height={340}
                            messages={stateMessages}
                            viewport={viewport}
                            userId={userId}
                            bearer={bearer}
                            cid={chat[0].id}
                        />
                    ) : (
                        <Button onClick={open}>Ouvrir un chat</Button>
                    )}
                </Grid.Col>
            </Grid>
        </>
    );
}

export async function getServerSideProps(ctx) {
    const sessionCallBack = await getSession(ctx);

    const authToken = new AuthToken(sessionCallBack.user.access_token);

    const res = await fetch(
        process.env.BASE_URL + `kid/family/${authToken.decodedToken.id}`,
        {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                Authorization: authToken.authorizationString,
            },
        }
    );
    const kids = await res.json();

    const res1 = await fetch(
        process.env.BASE_URL + `chat/${authToken.decodedToken.id}`,
        {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                Authorization: authToken.authorizationString,
            },
        }
    );

    const chat = await res1.json();

    let messages = [];
    if (chat) {
        const res2 = await fetch(
            process.env.BASE_URL + `message/${chat[0].id}`,
            {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: authToken.authorizationString,
                },
            }
        );
        messages = await res2.json();
    }

    return {
        props: {
            userId: sessionCallBack.user.id,
            bearer: authToken.authorizationString,
            kids,
            messages,
            chat,
            firstname: authToken.decodedToken.firstname,
            lastname: authToken.decodedToken.lastname,
        },
    };
}
