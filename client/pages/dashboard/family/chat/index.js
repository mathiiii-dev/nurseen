import {Button, Select} from "@mantine/core";
import {useState} from "react";
import {getSession} from "next-auth/react";
import {AuthToken} from "../../../../services/auth_token";
import Link from 'next/link'

function Chat({bearer, userId, chat}) {

    const open = (event) => {
        event.preventDefault()
        fetch(process.env.BASE_URL + `chat`,
            {
                method: 'POST',
                body: JSON.stringify({
                    family: userId,
                    nurse: 1
                }),
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': bearer
                }
            }).then(r => {
            console.log(r)
        })
    }
    return (
        <>
            <form onSubmit={open}>
                <Button type="submit" size={"lg"}
                        style={{backgroundColor: '#4ad4c6', float: 'right'}}>Ouvrir un chat</Button>
            </form>
            {chat ? chat.map(function (d, idx) {

                return (
                    <li key={idx}>
                        <Link
                            href={{
                                pathname: '/dashboard/family/chat/[cid]',
                                query: { cid: d.id },
                            }}
                        >
                            <p>{d.id}</p>
                        </Link>

                    </li>)
            }) : ''}
        </>
    );
}

export default Chat;

export async function getServerSideProps(ctx) {
    const sessionCallBack = await getSession(ctx);

    const authToken = new AuthToken(sessionCallBack.user.access_token);

    const res1 = await fetch(process.env.BASE_URL + `chat/1`,
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

