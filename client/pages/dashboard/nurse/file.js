import {getSession} from "next-auth/react"
import {AuthToken} from "../../../services/auth_token";
import {
    Accordion,
    Button,
    Card, Grid, Group,
    InputWrapper, List,
    Select,
    Space,
    Text,
    TextInput
} from "@mantine/core";
import {Dropzone, MIME_TYPES} from "@mantine/dropzone";
import {useState} from "react";
import FileManager from '../../../components/FileManager'

export const dropzoneChildrenUploaded = () => (
    <Text>Votre fichier à bien été ajouté</Text>
);

export const dropzoneChildren = (rejected) => (
    <>
        {
            rejected ? <Text>Votre fichier n'a pas été accepté</Text> : <Text>Cliquez ici pour ajouter un fichier</Text>
        }
    </>

);

export default function Page({userId, bearer, family, files}) {

    const [select, setSelect] = useState(null);
    const [file, setFile] = useState();
    const [uploaded, setUploaded] = useState(false);
    const [rejected, setRejected] = useState(false);
    const [title, setTitle] = useState()
    let style = null;

    if(rejected) {
        style = {
            border: '2px dashed red',
            color: 'red'
        }
    }

    if(!rejected) {
        style = null
    }

    let parents = null;
    console.log(family)
    if (family.length !== 0) {
        parents = family.map((element) => (
            {
                value: element.id.toString(),
                label: element.name
            }
        ))
    }

    const send = (event) => {
        event.preventDefault()
        const data = new FormData()
        data.append('file', file[0])
        data.append('sender', userId)
        data.append('recipient', select)
        data.append('name', title)
        fetch(process.env.BASE_URL + `file/${userId}/send`, {
            body: data,
            method: 'POST',
            headers: {
                'Authorization': bearer
            }

        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
            })
    }

    return (
        <>
            <Accordion initialItem={0} multiple>
                <Accordion.Item label="Formulaire d'envoie de fichier">
                    <form onSubmit={send}>
                        <Select
                            label="Destinataire"
                            placeholder="Nurseen Test"
                            data={parents}
                            value={select}
                            onChange={setSelect}
                        />
                        <Space h={"md"}/>
                        <TextInput
                            placeholder="Contrat du mois"
                            label="Nom du fichier"
                            value={title}
                            onChange={(e) => setTitle(e.currentTarget.value)}
                            required
                        />
                        <Space h={"md"}/>
                        <InputWrapper label="Fichier">
                            <Dropzone
                                styles={{
                                    root: style
                                }}
                                onDrop={(file) => {
                                    setFile(file)
                                    setUploaded(true)
                                    setRejected(false)
                                }}
                                onReject={(files) => setRejected(true)}
                                maxSize={3 * 1024 ** 2}
                                accept={[MIME_TYPES.csv, MIME_TYPES.doc, MIME_TYPES.docx, MIME_TYPES.pdf, MIME_TYPES.ppt, MIME_TYPES.pptx, MIME_TYPES.xls, MIME_TYPES.xlsx]}
                                multiple={false}
                            >
                                {uploaded ?
                                    (status) => dropzoneChildrenUploaded()
                                    :
                                    (status) => dropzoneChildren(rejected)
                                }
                            </Dropzone>
                        </InputWrapper>
                        <Space h={"md"}/>
                        <Button type={"submit"}>
                            Envoyer
                        </Button>
                    </form>
                </Accordion.Item>

                <Accordion.Item label="Mes fichiers reçus">
                    <FileManager files={files} userId={userId}/>
                </Accordion.Item>
            </Accordion>
        </>
    )
}

export async function getServerSideProps(ctx) {
    const sessionCallBack = await getSession(ctx);

    const authToken = new AuthToken(sessionCallBack.user.access_token);

    const res = await fetch(process.env.BASE_URL + `family/${authToken.decodedToken.id}/list`,
        {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': authToken.authorizationString
            }
        });

    const family = await res.json();

    const res1 = await fetch(process.env.BASE_URL + `file/${authToken.decodedToken.id}`,
        {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': authToken.authorizationString
            }
        });

    const files = await res1.json();

    return {
        props: {
            userId: sessionCallBack.user.id,
            bearer: authToken.authorizationString,
            family,
            files
        }
    }
}
