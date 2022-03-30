import {useState} from 'react';
import RichTextEditor from '../../../../../../components/rte';
import {Button, Space, Title} from "@mantine/core";
import {useRouter} from 'next/router'
import {useNotifications} from "@mantine/notifications";
import { getServerSideProps } from "../../../index";

function Note({userId, bearer}) {
    const router = useRouter();
    const [value, onChange] = useState('');
    const notifications = useNotifications();

    const create = (event) => {
        event.preventDefault()
        fetch(`http://localhost:8010/proxy/api/note/kid/${router.query.pid}`,
            {
                method: 'POST',
                body: JSON.stringify({
                    note: value
                }),
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': bearer
                }
            }).then(r => {
            if(r.status === 201) {
                onChange('')
                notifications.showNotification({
                    title: 'Note enregistrée',
                    message: 'Votre note a été enregistrée',
                    color: 'teal'
                })
            }
        })
    }

    return (
        <>
            <Space h="xl"/>

            <Space h="xl"/>
            <form onSubmit={create}>
                <RichTextEditor
                    styles={{
                        root: {height: 250}
                    }}
                    placeholder="Résumer en quelques phrases la journée d'un enfant"
                    value={value}
                    onChange={onChange}/>
                <Space h={"xl"}/>
                <Button type="submit" size={"lg"}
                        style={{backgroundColor: '#4ad4c6', float: 'right'}}>Enregistrer</Button>
            </form>

        </>
    );
}

export default Note;

export { getServerSideProps }
