import {privateRoute} from "../../../../../../../components/privateRoute";
import {useEffect, useState} from 'react';
import RichTextEditor from '../../../../../../../components/rte';
import {Button, Space, Title} from "@mantine/core";
import {useRouter} from 'next/router'


function Note({auth}) {
    const router = useRouter();
    const [value, onChange] = useState('');
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:8010/proxy/api/kid/${router.query.pid}`,
            {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': auth.authorizationString
                }
            })
            .then((res) => res.json())
            .then((data) => {
                setData(data)
            })
    }, [])

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
                    'Authorization': auth.authorizationString
                }
            }).then(r => console.log(r))
    }

    return (
        <>
            <Space h="xl"/>
            {
                data ?
                    <Title>Rédiger une note sur la journée de {data.firstname} </Title>
                    : ''
            }
            <Space h="xl"/>
            <form onSubmit={create}>
                <RichTextEditor
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

export default privateRoute(Note);