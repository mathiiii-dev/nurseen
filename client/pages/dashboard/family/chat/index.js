import { Button, Card, Space, Text } from '@mantine/core';
import { getSession } from 'next-auth/react';
import { AuthToken } from '../../../../services/auth_token';
import Link from 'next/link';

function FamilyChat({ bearer, userId, chat }) {
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
    return (
        <>
            <Space h={'xl'} />
            {chat.length !== 0 ? (
                chat.map(function (d, idx) {
                    return (
                        <>
                            <Link
                                href={{
                                    pathname: '/dashboard/family/chat/[cid]',
                                    query: { cid: d.chatId },
                                }}
                            >
                                <Card key={idx} shadow="sm" p="xl">
                                    <Text weight={500} size="lg">
                                        {d.family.name}
                                    </Text>

                                    <Text size="sm">
                                        {d.lastMessage
                                            ? d.lastMessage.message
                                            : 'Cliquez ici pour envoyer le premier message'}
                                    </Text>
                                </Card>
                            </Link>
                            <Space h={'xl'} />
                        </>
                    );
                })
            ) : (
                <>
                    <Text>
                        Vous souhaitez discuter en direct avec votre nourrice ?
                        C'est possible ici !
                    </Text>
                    <Text>
                        Cliquez sur ouvrir un chat, vous serez ensuite redirigé
                        vers un espace de chat en direct.
                    </Text>
                    <Button
                        onClick={open}
                        style={{ backgroundColor: '#4ad4c6' }}
                    >
                        Ouvrir un chat
                    </Button>
                </>
            )}
        </>
    );
}

export default FamilyChat;

export async function getServerSideProps(ctx) {
    const sessionCallBack = await getSession(ctx);

    const authToken = new AuthToken(sessionCallBack.user.access_token);

    const res1 = await fetch(
        process.env.BASE_URL + `chat/${authToken.decodedToken.id}/family`,
        {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                Authorization: authToken.authorizationString,
            },
        }
    );

    const chat = await res1.json();
    console.log(chat);

    return {
        props: {
            userId: sessionCallBack.user.id,
            bearer: authToken.authorizationString,
            chat,
        },
    };
}
