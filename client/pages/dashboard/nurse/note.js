import { useState } from 'react';
import RichTextEditor from '/components/rte';
import { Autocomplete, Button, Select, Space } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { getSession } from 'next-auth/react';
import { AuthToken } from '../../../services/auth_token';

function Note({ bearer, kids }) {
    const [value, onChange] = useState('');
    const [select, setSelect] = useState(null);
    let nurseKids = null;

    if (kids) {
        nurseKids = kids.map((element) => ({
            value: element.id.toString(),
            label: element.firstname + ' ' + element.lastname,
        }));
    }

    const create = (event) => {
        event.preventDefault();
        fetch(`${process.env.BASE_URL}note/kid/${select}`, {
            method: 'POST',
            body: JSON.stringify({
                note: value,
            }),
            headers: {
                'Content-type': 'application/json',
                Authorization: bearer,
            },
        }).then((r) => {
            if (r.status === 201) {
                onChange('');
                setSelect(null);
                showNotification({
                    title: 'Note enregistrée',
                    message: 'Votre note a été enregistrée',
                    color: 'teal',
                });
            }
        });
    };

    return (
        <>
            <form onSubmit={create}>
                <Select
                    searchable
                    nothingFound="No options"
                    value={select}
                    onChange={setSelect}
                    data={nurseKids}
                    label="Enfant"
                    placeholder="Choisir un enfant"
                />
                <Space h="xl" />
                <RichTextEditor
                    controls={[
                        ['bold', 'italic', 'underline', 'link'],
                        ['unorderedList', 'h1', 'h2', 'h3'],
                        ['sup', 'sub'],
                        ['alignLeft', 'alignCenter', 'alignRight'],
                    ]}
                    styles={{
                        root: { height: 250 },
                    }}
                    placeholder="Résumer en quelques phrases la journée d'un enfant"
                    value={value}
                    onChange={onChange}
                />
                <Space h={'xl'} />
                <Button
                    type="submit"
                    size={'lg'}
                    style={{ backgroundColor: '#4ad4c6', float: 'right' }}
                >
                    Enregistrer
                </Button>
            </form>
        </>
    );
}

export default Note;

export async function getServerSideProps(ctx) {
    const sessionCallBack = await getSession(ctx);

    const authToken = new AuthToken(sessionCallBack.user.access_token);

    const res = await fetch(
        `${process.env.BASE_URL}kid/nurse/${authToken.decodedToken.id}/all`,
        {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                Authorization: authToken.authorizationString,
            },
        }
    );
    const kids = await res.json();

    return {
        props: {
            userId: sessionCallBack.user.id,
            bearer: authToken.authorizationString,
            kids,
        },
    };
}
