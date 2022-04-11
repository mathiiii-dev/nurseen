import {AuthToken} from "../../../../services/auth_token";
import {getSession} from "next-auth/react";
import {Button, Space, Text, Title} from "@mantine/core";
import Link from 'next/link';

function Menu({menu}) {

    return (
        <div>
            { menu ?
                <>
                    <Title>Menu du {menu.date}</Title>
                    <Space h={'xl'}/>

                    <Title>Entrée</Title>
                    <Text>{menu.entry}</Text>
                    <Space h={'xl'}/>

                    <Title>Plat</Title>
                    <Text>{menu.meal}</Text>
                    <Space h={'xl'}/>

                    <Title>Dessert</Title>
                    <Text>{menu.dessert}</Text>
                </> :
                <>
                    <Text>Le menu du jour n'as pas encore été renseigné</Text>
                    <Link href='menu/add'>
                        <Button>Reiseigner le ici</Button>
                    </Link>
                </>
            }
        </div>
    )
}

export default Menu;

export async function getServerSideProps(ctx) {

    const sessionCallBack = await getSession(ctx);

    const authToken = new AuthToken(sessionCallBack.user.access_token);

    const res = await fetch(process.env.BASE_URL + `menu/${sessionCallBack.user.id}`,
        {
            method: 'GET',
            headers: {
                'Authorization': authToken.authorizationString
            }
        })

    const menu = await res.json();
    console.log(process.env.BASE_URL + `menu/${sessionCallBack.user.id}`)
    return {
        props:
            {
                menu
            }
    }
}
