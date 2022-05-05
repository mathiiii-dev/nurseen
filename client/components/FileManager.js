import {
    Accordion,
    Button,
    Card, Grid, List,
    Text,
} from "@mantine/core";


export default function Page({files, userId}) {

    const download = (url) => {
        if (typeof window !== "undefined") {
            window.location.href = url
        }
    }

    return (
        <>
            <Grid>
                <>
                    {
                        files.map((file) => (
                            <Grid.Col span={4} key={file.id}>
                                <Card shadow="sm" p="lg">
                                    <Text weight={500}>{file.url}</Text>
                                    <List>
                                        <List.Item>Envoyé par : {file.sender.firstname}</List.Item>
                                        <List.Item>Reçu le 24/04/2022</List.Item>
                                        <List.Item>Taille : 1.4 Mb</List.Item>
                                    </List>
                                    <Button style={{marginTop: 14}} variant="light" color="blue" fullWidth
                                            onClick={() => download(`${process.env.MEDIA_URL}file/${userId}/${file.url}`)}>Télécharger</Button>
                                </Card>
                            </Grid.Col>
                        ))
                    }
                </>
            </Grid>
        </>
    )
}
