import {
    Alert,
    Button,
    Grid,
    NumberInput,
    Space,
    TextInput,
    Title,
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useForm } from '@mantine/hooks';
import { useState } from 'react';
import { useNotifications } from '@mantine/notifications';
import 'dayjs/locale/fr';
import { getServerSideProps } from './index';

function CreateKid({ userId, bearer }) {
    const [errorMessage, setErrorMessage] = useState('');
    const [error, setError] = useState(false);
    const notifications = useNotifications();
    const form = useForm({
        initialValues: {
            code: '',
            firstname: '',
            lastname: '',
            birthday: '',
        },

        validationRules: {
            code: (code) => code !== '',
            firstname: (firstname) => firstname !== '',
            lastname: (lastname) => lastname !== '',
        },

        errorMessages: {
            code: 'Veuillez saisir un code',
            firstname: 'Veuillez saisir un prénom',
            lastname: 'Veuillez saisir un nom',
        },
    });

    const create = async (event) => {
        event.preventDefault();
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}family/${userId}/kid`, {
            method: 'POST',
            body: JSON.stringify({
                lastname: form.values.lastname,
                firstname: form.values.firstname,
                code: form.values.code,
                birthday: form.values.birthday,
            }),
            headers: {
                'Content-type': 'application/json',
                Authorization: bearer,
            },
        }).then((response) => {
            response.json();
            if (response.status && response.status !== 201) {
                setError(true);
                let message =
                    response.message ??
                    "Une erreur est survenue pendant l'envoie du formulaire. Veuillez contacter un administrateur.";
                setErrorMessage(message);
            } else {
                notifications.showNotification({
                    title: 'Enfant inscrit',
                    message:
                        'Votre nourrice va désormais pouvoir valider votre inscription',
                });
                form.reset();
            }
        });
    };

    return (
        <>
            <Grid
                style={{
                    backgroundColor: '#f4fdfc',
                    borderRadius: 11,
                    padding: 25,
                }}
            >
                <Grid.Col md={12} style={{ padding: 25 }}>
                    <Title>Inscription de votre enfant</Title>
                    {error ? (
                        <Alert
                            title="Erreur!"
                            color="red"
                            withCloseButton
                            closeButtonLabel="Close alert"
                            onClose={() => {
                                setError(false);
                            }}
                        >
                            {errorMessage}
                        </Alert>
                    ) : (
                        ''
                    )}
                    <Space h={'xl'} />
                    <form onSubmit={create}>
                        <NumberInput
                            placeholder="1234"
                            label="Code nourrice"
                            description="Si vous n'avez pas de code, rapprocher vous de votre nourrice pour qu'elle vous en créer un "
                            radius="xs"
                            size="xl"
                            {...form.getInputProps('code')}
                            required
                            hideControls
                        />
                        <Space h={'xl'} />
                        <TextInput
                            required
                            label="Prénom"
                            placeholder="John"
                            {...form.getInputProps('firstname')}
                            size={'xl'}
                        />
                        <Space h={'xl'} />
                        <TextInput
                            required
                            label="Nom"
                            placeholder="Doe"
                            {...form.getInputProps('lastname')}
                            size={'xl'}
                        />
                        <Space h={'xl'} />
                        <DatePicker
                            placeholder="17/08/1999"
                            label="Date d'anniversaire"
                            size={'xl'}
                            {...form.getInputProps('birthday')}
                            locale="fr"
                        />
                        <Space h={'xl'} />
                        <Button
                            type="submit"
                            size={'xl'}
                            style={{
                                backgroundColor: '#4ad4c6',
                                float: 'right',
                            }}
                        >
                            Inscription
                        </Button>
                    </form>
                </Grid.Col>
            </Grid>
        </>
    );
}

export default CreateKid;

export { getServerSideProps };
