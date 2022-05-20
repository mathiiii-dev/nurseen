import Menu from '../../../../components/Menu';
import { getSession } from 'next-auth/react';
import { AuthToken } from '../../../../services/auth_token';

function MenuFamily({ menu, role }) {
    return <Menu menu={menu} role={role} />;
}

export default MenuFamily;

export async function getServerSideProps(ctx) {
    const sessionCallBack = await getSession(ctx);

    const authToken = new AuthToken(sessionCallBack.user.access_token);

    const res = await fetch(
        process.env.BASE_URL + `menu/family/${sessionCallBack.user.id}`,
        {
            method: 'GET',
            headers: {
                Authorization: authToken.authorizationString,
            },
        }
    );

    const menu = await res.json();

    return {
        props: {
            role: sessionCallBack.user.role,
            menu,
        },
    };
}
