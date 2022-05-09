import RichTextEditor from '../../../components/rte';
import {useState} from "react";
import {Accordion, Button, Group, Space, Text, Title} from "@mantine/core";
import Gallery from "react-photo-gallery";
import {Dropzone, IMAGE_MIME_TYPE} from "@mantine/dropzone";
import {getSession} from "next-auth/react";
import {AuthToken} from "../../../services/auth_token";

export const dropzoneChildren = (status, theme) => (
    <Group position="center" spacing="xl" style={{minHeight: 220, pointerEvents: 'none'}}>
        <div>
            <Text size="xl" inline>
                Glisser/déposer vos images, ou cliquez pour les sélectionner
            </Text>
            <Text size="sm" color="dimmed" inline mt={7}>
                Ajouter autant d'images que vous voulez, tant qu'elle ne dépasse pas 5MB
            </Text>
        </div>
    </Group>
);

export const dropzoneChildrenUploaded = (status, theme, files) => (
    <Group position="center" spacing="xl" style={{minHeight: 220, pointerEvents: 'none'}}>
        <div>
            <Text size="xl" inline>
                {
                    files.length > 1 ?
                        <>
                            {files.length} images ont été ajoutées
                        </>
                        :
                        <>
                            {files.length} image a été ajoutée
                        </>
                }
            </Text>
            <Text size="sm" color="dimmed" inline mt={7}>
                Vous pouvez envoyer le formulaire
            </Text>
        </div>
    </Group>
);

function Feed({userId, bearer, feed}) {

    const [value, onChange] = useState("<p>Racontez les activités effectuer par les enfants</p>");
    const [uploaded, setUploaded] = useState(false);

    console.log(feed)

    function createMarkup(text) {
        return {
            __html: text
        };
    }

    const photos = [
        {
            src: "https://source.unsplash.com/2ShvY8Lf6l0/800x599",
            width: 4,
            height: 3
        },
        {
            src: "https://source.unsplash.com/Dm-qxdynoEc/800x799",
            width: 1,
            height: 1
        },
        {
            src: "https://source.unsplash.com/qDkso9nvCg0/600x799",
            width: 3,
            height: 4
        },
        {
            src: "https://source.unsplash.com/iecJiKe_RNg/600x799",
            width: 3,
            height: 4
        },
        {
            src: "https://source.unsplash.com/epcsn8Ed8kY/600x799",
            width: 3,
            height: 4
        }
    ];

    const send = (event) => {
        event.preventDefault()

        fetch(process.env.BASE_URL + `feed/${userId}`, {
            body: JSON.stringify({
                text: value
            }),
            method: 'POST',
            headers: {
                'Authorization': bearer
            }

        })
            .then((response) => response.json())

    }

    return (
        <>
            <Title>Donnez des nouvelles des enfants aux parents</Title>
            <Space h={"xl"}/>
            <form onSubmit={send}>
                <RichTextEditor
                    placeholder="Résumer en quelques phrases la journée d'un enfant"
                    value={value}
                    onChange={onChange}
                    controls={[
                        ['bold', 'italic', 'underline', 'link'],
                        ['unorderedList', 'h1', 'h2', 'h3'],
                        ['sup', 'sub'],
                        ['alignLeft', 'alignCenter', 'alignRight'],
                    ]}
                />
                <Space h={"xl"}/>
                <Accordion>
                    <Accordion.Item label="Ajouter des photos (max. 5)">
                        <Dropzone
                            onDrop={(files) => {
                                console.log('test')
                            }}
                            onReject={(files) => console.log('rejected files', files)}
                            maxSize={3 * 1024 ** 2}
                            accept={IMAGE_MIME_TYPE}
                        >
                            {uploaded ?
                                (status) => dropzoneChildrenUploaded(status)
                                :
                                (status) => dropzoneChildren(status)
                            }
                        </Dropzone>
                    </Accordion.Item>
                </Accordion>
                <Space h={"xl"}/>
                <Button type="submit" size={"md"}
                        style={{backgroundColor: '#4ad4c6', float: 'right'}}>Envoyez</Button>
            </form>
            <Space h={"xl"}/>
            <Space h={"xl"}/>
            <Space h={"xl"}/>
            {
                feed ? feed.map((f) => (
                    <>
                        <div style={{
                            backgroundColor: '#edf2f4',
                            padding: "16px",
                            borderRadius: "8px"
                        }}>
                            <Text>Mathias Micheli - 8 mai</Text>
                            <Text dangerouslySetInnerHTML={createMarkup(f.text)}/>
                            <Gallery photos={photos}/>
                        </div>
                        <Space h={"xl"}/>
                    </>
                )) : ''
            }

        </>
    )
}

export default Feed;

export async function getServerSideProps(ctx) {
    const sessionCallBack = await getSession(ctx);

    const authToken = new AuthToken(sessionCallBack.user.access_token);

    const res = await fetch(process.env.BASE_URL + `feed/${authToken.decodedToken.id}`,
        {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': authToken.authorizationString
            }
        });
    const feed = await res.json();

    return {
        props: {
            userId: sessionCallBack.user.id,
            bearer: authToken.authorizationString,
            feed
        }
    }
}

