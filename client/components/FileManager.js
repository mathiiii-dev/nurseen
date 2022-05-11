import {
    Accordion,
    Button,
    Card, Grid, List,
    Text,
} from "@mantine/core";
import dayjs from "dayjs";


export default function Page({files, userId}) {

    async function downloadUsingFetch(url, filename) {
        const file = await fetch(url);
        const fileBlob = await file.blob();
        const fileURL = URL.createObjectURL(fileBlob);

        const anchor = document.createElement("a");
        anchor.href = fileURL;
        anchor.download = filename;

        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        URL.revokeObjectURL(fileURL);
    }

    return (
        <>
            <Grid>
                <>
                    {
                        files.map((file) => (
                            <Grid.Col md={6} lg={3} key={file.id}>
                                <Card shadow="sm" p="lg">
                                    <Text weight={500}>{file.name}</Text>
                                    <List>
                                        <List.Item>Envoyé par : {file.sender.firstname}</List.Item>
                                        <List.Item>Reçu le {dayjs(file.sendDate).format('DD/MM/YYYY')}</List.Item>
                                    </List>
                                    <Button style={{marginTop: 14}} variant="light" color="blue" fullWidth
                                            onClick={() => downloadUsingFetch(`${process.env.MEDIA_URL}file/${userId}/${file.url}`, file.url)}>Télécharger</Button>
                                </Card>
                            </Grid.Col>
                        ))
                    }
                </>
            </Grid>
        </>
    )
}
