import {getSession} from "next-auth/react";
import {AuthToken} from "../../../services/auth_token";
import Link from 'next/link';
import {Button} from "@mantine/core";

function Family({userId, bearer}) {
    return (
        <>
            <p><strong>user</strong>: {bearer}</p>
            <p><strong>user</strong>: {userId}</p>
            <Link href={'family/create-kid'}>
                <Button>Create kid</Button>
            </Link>
            <Link href={'family/kid/list'}>
                <Button>List kid</Button>
            </Link>
            <Link href={'family/gallery'}>
                <Button>Gallery</Button>
            </Link>
        </>
    )
}

export default Family;

export async function getServerSideProps(ctx) {
    const sessionCallBack = await getSession(ctx);

    const authToken = new AuthToken(sessionCallBack.user.access_token);

    return {
        props: {
            userId: sessionCallBack.user.id,
            bearer: authToken.authorizationString,
        }
    }
}
