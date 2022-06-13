import Menu from '../../../../components/Menu';
import { getSession } from 'next-auth/react';
import { AuthToken } from '../../../../services/auth_token';

function MenuNurse({ menu, role }) {
    return <Menu menu={menu} role={role} />;
}

export default MenuNurse;

export async function getServerSideProps(ctx) {
    const sessionCallBack = await getSession(ctx);

    const authToken = new AuthToken(sessionCallBack.user.access_token);

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}menu/${sessionCallBack.user.id}`,
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
            menu,
            role: authToken.decodedToken.roles[0],
        },
    };
}
