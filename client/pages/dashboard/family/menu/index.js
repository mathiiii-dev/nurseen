import Menu from '../../../../components/Menu';
import { getSession } from 'next-auth/react';
import { AuthToken } from '../../../../services/auth_token';
import { Button, Text } from '@mantine/core';
import Link from 'next/link';

function MenuFamily({ menu, role }) {
    let wKid = true;
    if (menu) {
        if (menu.hasOwnProperty('kids')) {
            wKid = false;
        }
    }

    return (
        <>
            {wKid ? (
                <Menu menu={menu} role={role} />
            ) : (
                <>
                    <Text>
                        Vous devez enregistrer au moins un enfant pour
                        visualiser le menu
                    </Text>
                    <Link href={'create-kid'}>
                        <Button>Ajouter un enfant</Button>
                    </Link>
                </>
            )}
        </>
    );
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
