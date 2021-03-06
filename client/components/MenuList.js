import {Button, Center, Drawer, Image, SimpleGrid, Space, Text, Textarea} from '@mantine/core';
import dayjs from 'dayjs';
import { useState } from 'react';
import { DatePicker } from '@mantine/dates';
import 'dayjs/locale/fr';
import utc from "dayjs/plugin/utc";
import Link from "next/link";
import '../styles/globals.css';

function Menu({ menus, role, bearer }) {

    dayjs.locale('fr');
    dayjs.extend(utc);
    dayjs.utc().format();

    const [opened, setOpened] = useState(false);
    const [entry, setEntry] = useState('');
    const [meal, setMeal] = useState('');
    const [dessert, setDessert] = useState('');
    const [date, setDate] = useState('');
    const [selected, setSelected] = useState('');

    const edit = async () => {
        await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}menu/${selected}/edit`,
            {
                method: 'PATCH',
                body: JSON.stringify({
                    date,
                    entry,
                    meal,
                    dessert,
                }),
                headers: {
                    'Content-type': 'application/json',
                    Authorization: bearer,
                },
            }
        );
    };

    let list = [];
    if (menus) {
        list = menus.map((element) => (
            <tr key={element.id} className="tr">
                <td className="td" data-label="Date">{dayjs(element.date).utc().format('DD MMMM YYYY')}</td>
                <td className="td" data-label="Entrée">{element.entry}</td>
                <td className="td" data-label="Plat">{element.meal}</td>
                <td className="td" data-label="Dessert">{element.dessert}</td>
                <td className="td" data-label="Modifier">
                    <Button
                        onClick={() => {
                            setSelected(element.id);
                            setEntry(element.entry);
                            setMeal(element.meal);
                            setDessert(element.dessert);
                            setDate(new Date(element.date));
                            setOpened(true);
                        }}
                    >
                        Modifier
                    </Button>
                </td>
            </tr>
        ));
        if (role === 'ROLE_PARENT') {
            list = menus.map((element) => (
                <tr key={element.id} className="tr">
                    <td className="td" data-label="Date">{dayjs(element.date).utc().format('DD MMMM YYYY')}</td>
                    <td className="td" data-label="Entrée">{element.entry}</td>
                    <td className="td" data-label="Plat">{element.meal}</td>
                    <td className="td" data-label="Dessert">{element.dessert}</td>
                </tr>
            ));
        }
    }
    return (
        <div>
            {list.length > 0 ? (
                <>
                    {role === 'ROLE_PARENT' ? (
                        <table className="table">
                            <thead className="thead">
                                <tr className="tr">
                                    <th className="th" scope="col">Date</th>
                                    <th className="th" scope="col">Entrée</th>
                                    <th className="th" scope="col">Plat</th>
                                    <th className="th" scope="col">Dessert</th>
                                </tr>
                            </thead>
                            <tbody className="tbody">{list}</tbody>
                        </table>
                    ) : (
                        <>
                            <Drawer
                                opened={opened}
                                onClose={() => setOpened(false)}
                                title="Modifier le menu"
                                padding="xl"
                                size="xl"
                            >
                                {
                                    <form onSubmit={edit}>
                                        <Textarea
                                            placeholder="Carrote rapée"
                                            label="Entrée"
                                            required
                                            value={entry}
                                            onChange={(event) =>
                                                setEntry(
                                                    event.currentTarget.value
                                                )
                                            }
                                        />
                                        <Space h={'xl'} />
                                        <Textarea
                                            placeholder="Gratin de choufleur et rotis de veau"
                                            label="Plat"
                                            required
                                            value={meal}
                                            onChange={(event) =>
                                                setMeal(
                                                    event.currentTarget.value
                                                )
                                            }
                                        />
                                        <Space h={'xl'} />
                                        <Textarea
                                            placeholder="Yaourt et gateau"
                                            label="Dessert"
                                            required
                                            value={dessert}
                                            onChange={(event) =>
                                                setDessert(
                                                    event.currentTarget.value
                                                )
                                            }
                                        />
                                        <Space h={'xl'} />
                                        <DatePicker
                                            placeholder="Choisissez une date"
                                            label="Date"
                                            required
                                            value={date}
                                            onChange={setDate}
                                            locale="fr"
                                        />
                                        <Space h={'xl'} />
                                        <Button fullWidth type="submit">
                                            Ajouter
                                        </Button>
                                    </form>
                                }
                            </Drawer>
                            <table className="table">
                                <thead className="thead">
                                    <tr className="tr">
                                        <th className="th" scope="col">Date</th>
                                        <th className="th" scope="col">Entrée</th>
                                        <th className="th" scope="col">Plat</th>
                                        <th className="th" scope="col">Dessert</th>
                                        <th className="th" scope="col">Modifier</th>
                                    </tr>
                                </thead>
                                <tbody className="tbody">{list}</tbody>
                            </table>
                        </>
                    )}
                </>
            ) : (
                <>
                    <SimpleGrid cols={1}>
                        <Center>
                            <Space h={"xl"}/>
                            <div style={{width: 380, marginLeft: 'auto', marginRight: 'auto'}}>
                                <Image
                                    radius="md"
                                    src="/img/undraw_empty_re_opql.svg"
                                    alt="Random unsplash image"
                                />
                            </div>
                        </Center>
                        <Center>
                            <Text>
                                Aucun menu n'a encore été ajouté.
                            </Text>
                        </Center>
                        <Center>
                            <Link href={'add'}>
                                <Button>Ajouter un menu</Button>
                            </Link>
                        </Center>
                    </SimpleGrid>
                </>
            )}
        </div>
    );
}

export default Menu;
