import {privateRoute} from "../../../../components/privateRoute";

function Family({auth}) {
    return (
        <>
            <p><strong>user</strong>: {auth.decodedToken.email}</p>
            <p><strong>isValid</strong>: {auth.isValid.toString()}</p>
            <p><strong>isExpired</strong>: {auth.isExpired.toString()}</p>
            <p><strong>authorizationString</strong>: {auth.authorizationString}</p>
            <p><strong>expiresAt</strong>: {auth.expiresAt.toString()}</p>
        </>
    )
}

export default privateRoute(Family);