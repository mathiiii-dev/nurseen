import Menu from '../../../../components/Menu';
import { getSession } from 'next-auth/react';
import { AuthToken } from '../../../../services/auth_token';

function MenuNurse({ menu }) {
    return <Menu menu={menu} />;
}

export default MenuNurse;

export async function getServerSideProps(ctx) {
    const sessionCallBack = await getSession(ctx);

    const authToken = new AuthToken(sessionCallBack.user.access_token);

    const res = await fetch(
        `${process.env.BASE_URL}menu/${sessionCallBack.user.id}`,
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
        },
    };
}
