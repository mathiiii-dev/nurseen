import {
    Avatar,
    Button,
    Card,
    Center,
    Grid,
    Pagination,
    Select,
    Space,
    Text,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';
import { AuthToken } from '../../../../services/auth_token';
import Link from 'next/link';
import dayjs from 'dayjs';
import { usePagination } from '@mantine/hooks';

function NurseChat({ bearer, userId, family }) {
    const [select, setSelect] = useState(null);
    const [chat, setChat] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, onChange] = useState(1);
    const [total, setTotal] = useState(1);
    const pagination = usePagination({ total, page, onChange });

    useEffect(() => {
        setLoading(true);
        fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}chat/${userId}/nurse?page=${page}`,
            {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: bearer,
                },
            }
        )
            .then((res) => res.json())
            .then((data) => {
                setLoading(false);
                setChat(data.items);
                setTotal(data.pagination.total_pages);
            });
    }, [page]);

    let parents = null;
    if (family.length !== 0) {
        parents = family.map((element) => ({
            value: element.id.toString(),
            label: element.name,
        }));
    }

    const open = async () => {
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}chat`, {
            method: 'POST',
            body: JSON.stringify({
                nurse: userId,
                family: select,
            }),
            headers: {
                'Content-type': 'application/json',
                Authorization: bearer,
            },
        });
    };

    const getFirstChar = (str) => {
        return str.substring(0, 1);
    };

    return (
        <>
            {family.length !== 0 && (
                <form onSubmit={open}>
                    <Grid columns={18}>
                        <Grid.Col span={12}>
                            <Select
                                value={select}
                                onChange={setSelect}
                                data={parents}
                                label="Parent"
                                placeholder="Choisir un parent"
                            />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <Button
                                type="submit"
                                style={{
                                    backgroundColor: '#4ad4c6',
                                    marginTop: 27,
                                }}
                            >
                                Ouvrir un chat
                            </Button>
                        </Grid.Col>
                    </Grid>
                </form>
            )}
            <Space h={'xl'} />
            <Space h={'xl'} />
            <Space h={'xl'} />

            {chat.length > 0 ? (
                chat.map(function (d, idx) {
                    return (
                        <div key={idx}>
                            <Link
                                href={{
                                    pathname: '/dashboard/nurse/chat/[cid]',
                                    query: { cid: d.chatId },
                                }}
                            >
                                <Grid
                                    style={{
                                        backgroundColor: '#E4E6EB',
                                        padding: '10px',
                                        borderRadius: '11px',
                                    }}
                                >
                                    <Grid.Col md={1}>
                                        <Center>
                                            <Avatar color="cyan" radius="xl">
                                                {getFirstChar(
                                                    d.family.name.split(' ')[0]
                                                ) +
                                                    ' ' +
                                                    getFirstChar(
                                                        d.family.name.split(
                                                            ' '
                                                        )[1]
                                                    )}
                                            </Avatar>
                                        </Center>
                                    </Grid.Col>
                                    <Grid.Col md={11}>
                                        <Text weight={500} size="lg">
                                            {d.family.name}
                                        </Text>
                                        <Card
                                            key={idx}
                                            shadow="sm"
                                            p="xl"
                                            radius={'md'}
                                        >
                                            <Text size="lg">
                                                {d.lastMessage
                                                    ? 'Dernier message : ' +
                                                      d.lastMessage.message.substring(
                                                          0,
                                                          88
                                                      ) +
                                                      ' - ' +
                                                      dayjs(
                                                          d.lastMessage.sendDate
                                                      ).format('DD/MM HH:mm')
                                                    : 'Aucun message envoyé'}
                                            </Text>
                                        </Card>
                                    </Grid.Col>
                                </Grid>
                            </Link>
                            <Space h={'xl'} />
                        </div>
                    );
                })
            ) : (
                <Text>
                    Aucun n'enfant n'est rélié à vous. Vous n'avez donc pas la
                    possiblité d'envoyé de message à des parents
                </Text>
            )}
            {chat.length > 0 && (
                <Center>
                    <Pagination total={total} onChange={onChange} />
                </Center>
            )}
        </>
    );
}

export default NurseChat;

export async function getServerSideProps(ctx) {
    const sessionCallBack = await getSession(ctx);

    const authToken = new AuthToken(sessionCallBack.user.access_token);

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}family/${authToken.decodedToken.id}`,
        {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                Authorization: authToken.authorizationString,
            },
        }
    );

    const family = await res.json();

    return {
        props: {
            userId: sessionCallBack.user.id,
            bearer: authToken.authorizationString,
            family,
        },
    };
}
