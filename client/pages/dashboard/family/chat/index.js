import {Card, Space, Text} from "@mantine/core";
import {getSession} from "next-auth/react";
import {AuthToken} from "../../../../services/auth_token";
import Link from 'next/link'

function FamilyChat({bearer, userId, chat}) {

    return (
        <>
            <Space h={"xl"}/>
            {chat ? chat.map(function (d, idx) {
                return (
                    <>
                        <Link
                            href={{
                                pathname: '/dashboard/family/chat/[cid]',
                                query: {cid: d.chatId},
                            }}
                        >
                            <Card
                                key={idx}
                                shadow="sm"
                                p="xl"
                            >
                                <Text weight={500} size="lg">
                                    {d.family.name}
                                </Text>

                                <Text size="sm">
                                    {d.lastMessage.message}
                                </Text>
                            </Card>
                        </Link>
                        <Space h={"xl"}/>
                    </>
                )
            }) : ''}
        </>
    );
}

export default FamilyChat;

export async function getServerSideProps(ctx) {
    const sessionCallBack = await getSession(ctx);

    const authToken = new AuthToken(sessionCallBack.user.access_token);

    const res1 = await fetch(process.env.BASE_URL + `chat/${authToken.decodedToken.id}/family`,
        {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': authToken.authorizationString
            }
        });

    const chat = await res1.json();

    return {
        props: {
            userId: sessionCallBack.user.id,
            bearer: authToken.authorizationString,
            chat
        }
    }
}

