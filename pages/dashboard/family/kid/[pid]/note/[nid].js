import {getServerSideProps} from "../../../index";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Button, Text} from "@mantine/core";

function Note({userId, bearer}) {
    const router = useRouter();
    const [note, setNote] = useState();
    useEffect(() => {
        fetch(`http://localhost:8010/proxy/api/note/${router.query.nid}`,
            {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': bearer
                }
            })
            .then((res) => res.json())
            .then((data) => {
                setNote(data)
            })
    }, [])
    return (
        <>
            <Button type="button" onClick={() => router.back()}>
                Retour
            </Button>
            {
                note ? <Text dangerouslySetInnerHTML={{__html: note.note}}/> : ''
            }

        </>
    )
}

export default Note;

export {getServerSideProps};