import {Button, Space, Text, Title} from "@mantine/core";
import Link from 'next/link';

function Menu({menu, role}) {
    console.log(menu)
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
                    {
                        role === 'ROLE_PARENT' ?
                            <>
                                <Text>Le menu du jour n'as pas encore été renseigné</Text>
                            </> :
                            <>
                                <Text>Le menu du jour n'as pas encore été renseigné</Text>
                                <Link href='menu/add'>
                                    <Button>Reiseigner le ici</Button>
                                </Link>
                            </>
                    }
                </>
            }
        </div>
    )
}

export default Menu;
