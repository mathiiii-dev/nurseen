import {Button, Textarea} from "@mantine/core";
import {getServerSideProps} from "./index";
import {useEffect, useState} from "react";
import EventSource from 'eventsource';

function Chat({bearer, userId, messages}) {

    const [stateMessages, setStateMessages] = useState(messages);
    const [value, setValue] = useState('');

    useEffect(() => {
        const url = new URL('http://localhost:9090/.well-known/mercure')
        url.searchParams.append('topic', 'http://localhost:8010/proxy/api/message')
        url.searchParams.append('topic', 'http://localhost:8010/proxy/api/message/ping')
        const eventSource = new EventSource(url.toString())
        eventSource.onmessage = e => {
            // Will be called every time an update is published by the server
            let origin = JSON.parse(e.data)

            setStateMessages(state => [...state, {
                id: origin.id,
                message: origin.data
            }])

        }
    }, [])

    const send = (event) => {
        event.preventDefault()
        fetch(process.env.BASE_URL + `message`,
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

    const ping = (event) => {
        event.preventDefault()
        fetch(process.env.BASE_URL + `message/ping`,
            {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': bearer
                }
            }).then(r => r.json())
            .then(res => console.log(res))
    }

    return (
        <>
            <p>prout</p>
            {stateMessages ? stateMessages.map(function (d, idx) {
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
            <Button onClick={ping}>Ping</Button>
        </>
    );
}

export default Chat;

export {getServerSideProps};
