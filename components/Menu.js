import {Button, Space, Text, Title} from "@mantine/core";
import Link from 'next/link';
import dayjs from "dayjs";
import 'dayjs/locale/fr';

function Menu({menu, role}) {
    return (
        <div>
            { menu ?
                <>
                    <Title order={1}>Menu du {dayjs(menu.date).add(1, 'day').locale('fr').format('DD MMMM YYYY')}</Title>
                    <Space h={'xl'}/>

                    <Title order={2}>Entrée</Title>
                    <Text>{menu.entry}</Text>
                    <Space h={'xl'}/>

                    <Title order={2}>Plat</Title>
                    <Text>{menu.meal}</Text>
                    <Space h={'xl'}/>

                    <Title order={2}>Dessert</Title>
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
