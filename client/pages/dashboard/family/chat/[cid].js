import Chat from '../../../../components/Chat';
import { getSession } from 'next-auth/react';
import { AuthToken } from '../../../../services/auth_token';
import EventSource from 'eventsource';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import { scrollToBottom } from '../../../../services/scroll';

function MessageFamily({ messages, userId, bearer }) {
    const viewport = useRef();
    const router = useRouter();
    const { cid } = router.query;
    const [stateMessages, setStateMessages] = useState(messages);

    useEffect(() => {
        scrollToBottom(viewport);
        const url = new URL('http://localhost:9090/.well-known/mercure');
        url.searchParams.append(
            'topic',
            `http://localhost:8010/proxy/api/message/${cid}`
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
                        id: userId,
                        firstname: origin.firstname,
                        lastname: origin.lastname,
                    },
                    sendDate: dayjs().toString(),
                },
            ]);

            scrollToBottom(viewport);
        };
    }, []);

    return (
        <>
            <Chat
                messages={stateMessages}
                viewport={viewport}
                userId={userId}
                bearer={bearer}
                cid={cid}
            />
        </>
    );
}

export default MessageFamily;

export async function getServerSideProps(ctx) {
    const sessionCallBack = await getSession(ctx);

    const authToken = new AuthToken(sessionCallBack.user.access_token);
    const cid = ctx.params.cid;

    const res = await fetch(process.env.BASE_URL + `message/${cid}`, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
            Authorization: authToken.authorizationString,
        },
    });

    const messages = await res.json();

    return {
        props: {
            userId: sessionCallBack.user.id,
            bearer: authToken.authorizationString,
            messages,
        },
    };
}
