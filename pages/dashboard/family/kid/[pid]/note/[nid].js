import {useRouter} from "next/router";
import {Button, Text} from "@mantine/core";
import {getSession} from "next-auth/react";
import {AuthToken} from "../../../../../../services/auth_token";

function Note({note}) {

    const router = useRouter();

    return (
        <>
            <Button type="button" onClick={() => router.back()}>
                Retour
            </Button>
            {
                note ? <Text dangerouslySetInnerHTML={{__html: note.note}}/> : ''
            }
        </>
    )
}

export default Note;

export async function getServerSideProps(ctx) {
    const sessionCallBack = await getSession(ctx);

    const authToken = new AuthToken(sessionCallBack.user.access_token);

    const res = await fetch(`http://localhost:8010/proxy/api/note/${ctx.params.nid}`,
        {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': authToken.authorizationString
            }
        });

    const note = await res.json()

    return {
        props: {
            note
        }
    }
}