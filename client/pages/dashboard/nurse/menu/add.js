import { Space, Button, Title, Textarea } from '@mantine/core';
import { getServerSideProps } from './../index';
import { DatePicker } from '@mantine/dates';
import { useForm } from '@mantine/hooks';
import { useRouter } from 'next/router';

function AddMenu({ bearer, userId }) {
    const router = useRouter();

    const form = useForm({
        initialValues: {
            date: '',
            entry: '',
            meal: '',
            dessert: '',
        },

        validate: {
            entry: (entry) => entry !== '',
            meal: (meal) => meal !== '',
            dessert: (dessert) => dessert !== '',
        },
    });

    const add = (event) => {
        event.preventDefault();
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}menu/add/${userId}`, {
            body: JSON.stringify({
                date: form.values.date,
                entry: form.values.entry,
                meal: form.values.meal,
                dessert: form.values.dessert,
            }),
            method: 'POST',
            headers: {
                Authorization: bearer,
            },
        })
            .then((response) => response.json())
            .then((r) => {
                router.push('/dashboard/nurse/menu');
            });
    };

    return (
        <>
            <Title>Ajouter le menu du jour</Title>
            <Space h={'xl'} />
            <form onSubmit={add}>
                <Textarea
                    placeholder="Carrote rapée"
                    label="Entrée"
                    required
                    {...form.getInputProps('entry')}
                />
                <Space h={'xl'} />
                <Textarea
                    placeholder="Gratin de choufleur et rotis de veau"
                    label="Plat"
                    required
                    {...form.getInputProps('meal')}
                />
                <Space h={'xl'} />
                <Textarea
                    placeholder="Yaourt et gateau"
                    label="Dessert"
                    required
                    {...form.getInputProps('dessert')}
                />
                <Space h={'xl'} />
                <DatePicker
                    placeholder="Pick date"
                    label="Event date"
                    required
                    {...form.getInputProps('date')}
                />
                <Space h={'xl'} />
                <Button fullWidth type="submit">
                    Ajouter
                </Button>
            </form>
        </>
    );
}

export default AddMenu;

export { getServerSideProps };
