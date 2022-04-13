import MenuList from "../../../../components/MenuList";
import {getSession} from "next-auth/react";
import {AuthToken} from "../../../../services/auth_token";

function MenuListFamily({menus, role}) {

    return (
        <>
            <MenuList menus={menus} role={role}/>
        </>
    )
}

export default MenuListFamily;

export async function getServerSideProps(ctx) {

    const sessionCallBack = await getSession(ctx);

    const authToken = new AuthToken(sessionCallBack.user.access_token);

    const res = await fetch(process.env.BASE_URL + `menu/family/${sessionCallBack.user.id}/list`,
        {
            method: 'GET',
            headers: {
                'Authorization': authToken.authorizationString
            }
        })

    const menus = await res.json();

    return {
        props:
            {
                role: sessionCallBack.user.role,
                menus
            }
    }
}
