import {Button, Textarea} from "@mantine/core";
import {getServerSideProps} from "./index";
import {useEffect, useState} from "react";
import EventSource from 'eventsource';

function Chat({bearer, userId}) {

    const [value, setValue] = useState('');
    const [messages, setMessages] = useState(null);

    const url = new URL('http://localhost:8010/proxy/.well-known/mercure')
    url.searchParams.append('topic', 'http://localhost:8010/proxy/api/message')
    url.searchParams.append('topic', 'http://localhost:8010/proxy/api/message/ping')
    const eventSource = new EventSource(url.toString())
    eventSource.onmessage = event => {
        // Will be called every time an update is published by the server
        console.log(JSON.parse(event.data));
    }

    useEffect(() => {
        fetch(process.env.BASE_URL + `message`,
            {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': bearer
                }
            }).then(r => r.json())
            .then(res => setMessages(res))

    }, []);

    if (messages) {
        console.log('po', messages)
    }

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
            .then(res => console.log(res))
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
