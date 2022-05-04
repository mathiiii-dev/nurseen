import {getSession} from "next-auth/react"
import {AuthToken} from "../../../services/auth_token";
import {
    Accordion,
    Button,
    Card, Grid,
    InputWrapper, List,
    Select,
    Space,
    Text,
    TextInput
} from "@mantine/core";
import {Dropzone} from "@mantine/dropzone";
import {useState} from "react";

export default function Page({userId, bearer, family}) {

    const dropzoneChildren = (status, theme) => (
        <Text>Cliquez ici pour ajouter un fichier</Text>
    );

    const [select, setSelect] = useState(null);
    const [file, setFile] = useState();

    let parents = null;
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
                            required
                        />
                        <Space h={"md"}/>
                        <InputWrapper label="Fichier">
                            <Dropzone
                                onDrop={(file) => setFile(file)}
                                onReject={(files) => console.log('rejected files', files)}
                                maxSize={3 * 1024 ** 2}
                            >
                                {(status) => dropzoneChildren(status)}
                            </Dropzone>
                        </InputWrapper>
                        <Space h={"md"}/>
                        <Button type={"submit"}>
                            Envoyer
                        </Button>
                    </form>
                </Accordion.Item>

                <Accordion.Item label="Mes fichiers reçus">
                    <Grid>
                        <Grid.Col span={4}>
                            <Card shadow="sm" p="lg">
                                <Text weight={500}>Nom du fichiers</Text>
                                <List>
                                    <List.Item>Envoyé par : John Doe</List.Item>
                                    <List.Item>Reçu le 24/04/2022</List.Item>
                                    <List.Item>Taille : 1.4 Mb</List.Item>
                                </List>

                                <Button variant="light" color="blue" fullWidth style={{marginTop: 14}}>
                                   Télécharger
                                </Button>
                            </Card>
                        </Grid.Col>
                        <Grid.Col span={4}>
                            <Card shadow="sm" p="lg">
                                <Text weight={500}>Nom du fichiers</Text>
                                <List>
                                    <List.Item>Envoyé par : John Doe</List.Item>
                                    <List.Item>Reçu le 24/04/2022</List.Item>
                                    <List.Item>Taille : 1.4 Mb</List.Item>
                                </List>

                                <Button variant="light" color="blue" fullWidth style={{marginTop: 14}}>
                                    Télécharger
                                </Button>
                            </Card>
                        </Grid.Col>
                        <Grid.Col span={4}><Card shadow="sm" p="lg">
                            <Text weight={500}>Nom du fichiers</Text>
                            <List>
                                <List.Item>Envoyé par : John Doe</List.Item>
                                <List.Item>Reçu le 24/04/2022</List.Item>
                                <List.Item>Taille : 1.4 Mb</List.Item>
                            </List>

                            <Button variant="light" color="blue" fullWidth style={{marginTop: 14}}>
                                Télécharger
                            </Button>
                        </Card>
                        </Grid.Col>
                        <Grid.Col span={4}><Card shadow="sm" p="lg">
                            <Text weight={500}>Nom du fichiers</Text>
                            <List>
                                <List.Item>Envoyé par : John Doe</List.Item>
                                <List.Item>Reçu le 24/04/2022</List.Item>
                                <List.Item>Taille : 1.4 Mb</List.Item>
                            </List>

                            <Button variant="light" color="blue" fullWidth style={{marginTop: 14}}>
                                Télécharger
                            </Button>
                        </Card></Grid.Col>
                        <Grid.Col span={4}>3</Grid.Col>
                        <Grid.Col span={4}>3</Grid.Col>
                        <Grid.Col span={4}>3</Grid.Col>
                        <Grid.Col span={4}>3</Grid.Col>
                        <Grid.Col span={4}>3</Grid.Col>
                    </Grid>
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

    return {
        props: {
            userId: sessionCallBack.user.id,
            bearer: authToken.authorizationString,
            family
        }
    }
}
