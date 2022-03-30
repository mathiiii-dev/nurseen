import {getSession} from "next-auth/react";
import {AuthToken} from "../../../services/auth_token";

function Family({userId, bearer}) {
    return (
        <>
            <p><strong>user</strong>: {bearer}</p>
            <p><strong>user</strong>: {userId}</p>
        </>
    )
}

export default Family;

export async function getServerSideProps(ctx) {
    const sessionCallBack = await getSession(ctx);

    if (sessionCallBack && sessionCallBack.user.role !== 'ROLE_PARENT') {
        return {
            redirect: {
                destination: '/dashboard/nurse',
                permanent: false
            },
        }
    }

    if (!sessionCallBack || sessionCallBack.user.role !== 'ROLE_PARENT') {
        return {
            redirect: {
                destination: '/sign-in',
                permanent: false
            },
        }
    }

    const authToken = new AuthToken(sessionCallBack.user.access_token);

    return {
        props: {
            userId: sessionCallBack.user.id,
            bearer: authToken.authorizationString,
        }
    }
}