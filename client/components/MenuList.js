import { Button, Drawer, Space, Table, Text, Textarea } from '@mantine/core';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useState } from 'react';
import { DatePicker } from '@mantine/dates';

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

    let list = null;
    if (menus) {
        list = menus.map((element) => (
            <tr key={element.id}>
                <td>{dayjs(element.date).utc().format('DD MMMM YYYY')}</td>
                <td>{element.entry}</td>
                <td>{element.meal}</td>
                <td>{element.dessert}</td>
                <td>
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
                <tr key={element.id}>
                    <td>{dayjs(element.date).utc().format('DD MMMM YYYY')}</td>
                    <td>{element.entry}</td>
                    <td>{element.meal}</td>
                    <td>{element.dessert}</td>
                </tr>
            ));
        }
    }
    return (
        <div>
            {list ? (
                <>
                    {role === 'ROLE_PARENT' ? (
                        <Table
                            horizontalSpacing="xl"
                            verticalSpacing="xl"
                            style={{ marginTop: 10 }}
                        >
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Entrée</th>
                                    <th>Plat</th>
                                    <th>Dessert</th>
                                </tr>
                            </thead>
                            <tbody>{list}</tbody>
                        </Table>
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
                                            placeholder="Pick date"
                                            label="Event date"
                                            required
                                            value={date}
                                            onChange={setDate}
                                        />
                                        <Space h={'xl'} />
                                        <Button fullWidth type="submit">
                                            Ajouter
                                        </Button>
                                    </form>
                                }
                            </Drawer>
                            <Table
                                horizontalSpacing="xl"
                                verticalSpacing="xl"
                                style={{ marginTop: 10 }}
                            >
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Entrée</th>
                                        <th>Plat</th>
                                        <th>Dessert</th>
                                        <th>Modifier</th>
                                    </tr>
                                </thead>
                                <tbody>{list}</tbody>
                            </Table>
                        </>
                    )}
                </>
            ) : (
                <>
                    <Text>Le menu du jour n'as pas encore été renseigné</Text>
                </>
            )}
        </div>
    );
}

export default Menu;
