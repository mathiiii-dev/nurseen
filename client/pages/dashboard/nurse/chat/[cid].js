import Chat from '../../../../components/Chat';
import { getSession } from 'next-auth/react';
import { AuthToken } from '../../../../services/auth_token';
import EventSource from 'eventsource';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { scrollToBottom } from '../../../../services/scroll';

export default function MessageNurse({ messages, userId, bearer }) {
    const viewport = useRef();
    const router = useRouter();
    const { cid } = router.query;
    const [stateMessages, setStateMessages] = useState(messages);

    useEffect(() => {
        scrollToBottom(viewport);
        const url = new URL(`${process.env.NEXT_PUBLIC_MERCURE_URL}`);
        url.searchParams.append(
            'topic',
            `${process.env.NEXT_PUBLIC_BASE_URL}message/${cid}`
        );
        const eventSource = new EventSource(url.toString());

        eventSource.onmessage = (e) => {
            let origin = JSON.parse(e.data);
            setStateMessages((state) => [
                ...state,
                {
                    id: origin.id,
                    message: origin.data,
                    user: {
                        id: origin.userId,
                        lastname: origin.lastname,
                        firstname: origin.firstname,
                    },
                    sendDate: origin.sendDate,
                },
            ]);
            scrollToBottom(viewport);
        };
    }, []);

    return (
        <>
            <Chat
                height={600}
                messages={stateMessages}
                viewport={viewport}
                userId={userId}
                bearer={bearer}
                cid={cid}
            />
        </>
    );
}

export async function getServerSideProps(ctx) {
    const sessionCallBack = await getSession(ctx);

    const authToken = new AuthToken(sessionCallBack.user.access_token);
    const cid = ctx.params.cid;

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}message/${cid}`,
        {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                Authorization: authToken.authorizationString,
            },
        }
    );

    const messages = await res.json();

    if (messages.error) {
        return {
            notFound: true,
        };
    }
    return {
        props: {
            userId: sessionCallBack.user.id,
            bearer: authToken.authorizationString,
            messages,
        },
    };
}
