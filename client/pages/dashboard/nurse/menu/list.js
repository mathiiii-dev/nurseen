import MenuList from '../../../../components/MenuList';
import { getSession } from 'next-auth/react';
import { AuthToken } from '../../../../services/auth_token';

function MenuListNurse({ menus, role, bearer }) {
    return <MenuList menus={menus} role={role} bearer={bearer} />;
}

export default MenuListNurse;

export async function getServerSideProps(ctx) {
    const sessionCallBack = await getSession(ctx);

    const authToken = new AuthToken(sessionCallBack.user.access_token);

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}menu/${sessionCallBack.user.id}/list`,
        {
            method: 'GET',
            headers: {
                Authorization: authToken.authorizationString,
            },
        }
    );

    const menus = await res.json();

    return {
        props: {
            role: sessionCallBack.user.role,
            menus,
            bearer: authToken.authorizationString,
        },
    };
}
