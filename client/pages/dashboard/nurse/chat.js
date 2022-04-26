import {Button, Textarea} from "@mantine/core";
import {getServerSideProps} from "./index";
import {useState} from "react";

function Chat({bearer, userId}) {

    const [value, setValue] = useState('');

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
        </>
    );
}

export default Chat;

export {getServerSideProps};
