import {Button, Textarea} from "@mantine/core";
import {useEffect, useState} from "react";
import EventSource from 'eventsource';
import {getSession} from "next-auth/react";
import {AuthToken} from "../../../../services/auth_token";
import {useRouter} from "next/router";

function Message({bearer, userId, messages}) {

    const [stateMessages, setStateMessages] = useState(messages);
    const [value, setValue] = useState('');
    const router = useRouter()
    const { cid } = router.query

    useEffect(() => {
        const url = new URL('http://localhost:9090/.well-known/mercure')
        url.searchParams.append('topic', `http://localhost:8010/proxy/api/message/${cid}`)
        const eventSource = new EventSource(url.toString())
        eventSource.onmessage = e => {

            let origin = JSON.parse(e.data)
            setStateMessages(state => [...state, {
                id: origin.id,
                message: origin.data
            }])

        }
    }, [])

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
            })
    }

    return (
        <>
            <p>prout</p>
            {!stateMessages.error ? stateMessages.map(function (d, idx) {
                return (<li key={idx}>{d.message}</li>)
            }) : ''}
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

export default Message;

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

