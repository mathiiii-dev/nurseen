import {Button, ScrollArea, Text, Textarea} from "@mantine/core";
import {useEffect, useRef, useState} from "react";
import EventSource from 'eventsource';
import {getSession} from "next-auth/react";
import {AuthToken} from "../../../../services/auth_token";
import {useRouter} from "next/router";

function MessageNurse({bearer, userId, messages}) {

    const [stateMessages, setStateMessages] = useState(messages);
    const [value, setValue] = useState('');
    const router = useRouter()
    const { cid } = router.query

    useEffect(() => {
        scrollToBottom()
        const url = new URL('http://localhost:9090/.well-known/mercure')
        url.searchParams.append('topic', `http://localhost:8010/proxy/api/message/${cid}`)
        const eventSource = new EventSource(url.toString())
        eventSource.onmessage = e => {

            let origin = JSON.parse(e.data)
            setStateMessages(state => [...state, {
                id: origin.id,
                message: origin.data,
                user: {
                    id: userId,
                    email: ''
                }
            }])
            scrollToBottom()
        }
    }, [])

    const viewport = useRef();

    const scrollToBottom = () =>
        viewport.current.scrollTo({ top: viewport.current.scrollHeight, behavior: 'smooth' });

    const send = (event) => {
        event.preventDefault()
        fetch(process.env.BASE_URL + `message/${cid}`,
            {
                method: 'POST',
                body: JSON.stringify({
                    message: value,
                    user: userId
                }),
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': bearer
                }
            }).then(r => r.json())
            .then(res => {
                setValue('')
                console.log(res)
                scrollToBottom()
            })
    }

    return (
        <>
            <ScrollArea viewportRef={viewport} style={{ height: 250 }}>
                {!stateMessages.error ? stateMessages.map(function (d, idx) {
                    console.log(d)
                    if(d.user.id === userId) {
                        return (
                            <Text key={idx}>{d.message}</Text>
                        )
                    }
                    return <Text key={idx} style={{
                        color: 'pink',
                    }
                    }>{d.message}</Text>
                }) : ''}
            </ScrollArea>

            <form onSubmit={send}>
                <Textarea
                    required
                    label="Message"
                    placeholder="Howdy!"
                    value={value} onChange={(event) => setValue(event.currentTarget.value)}
                />
                <Button type="submit">Submit</Button>
            </form>
        </>
    );
}

export default MessageNurse;

export async function getServerSideProps(ctx) {
    const sessionCallBack = await getSession(ctx);

    const authToken = new AuthToken(sessionCallBack.user.access_token);
    const cid = ctx.params.cid

    const res = await fetch(process.env.BASE_URL + `message/${cid}`,
        {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': authToken.authorizationString
            }
        });
    const messages = await res.json();

    return {
        props: {
            userId: sessionCallBack.user.id,
            bearer: authToken.authorizationString,
            messages
        }
    }
}

