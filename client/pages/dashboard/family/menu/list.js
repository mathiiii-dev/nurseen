import MenuList from '../../../../components/MenuList';
import { getSession } from 'next-auth/react';
import { AuthToken } from '../../../../services/auth_token';
import NonKidsMessage from '../../../../components/NoKidsMessage';

function MenuListFamily({ menus, role }) {
    let wKid = true;
    if (menus) {
        if (menus.hasOwnProperty('kids')) {
            wKid = false;
        }
    }
    return (
        <>
            {wKid ? (
                <MenuList menus={menus} role={role} />
            ) : (
                <NonKidsMessage
                    message={
                        ' Vous devez enregistrer au moins un enfant pour visualiser le menu'
                    }
                />
            )}
        </>
    );
}

export default MenuListFamily;

export async function getServerSideProps(ctx) {
    const sessionCallBack = await getSession(ctx);

    const authToken = new AuthToken(sessionCallBack.user.access_token);

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}menu/family/${sessionCallBack.user.id}/list`,
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
        },
    };
}
