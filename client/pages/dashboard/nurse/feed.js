import RichTextEditor from '../../../components/rte';
import {useState} from 'react';
import {
    Accordion,
    Button,
    Group,
    Space,
    Text,
    Title,
    Modal,
    Center,
    Drawer, LoadingOverlay,
} from '@mantine/core';
import {Dropzone, IMAGE_MIME_TYPE} from '@mantine/dropzone';
import {getSession} from 'next-auth/react';
import {AuthToken} from '../../../services/auth_token';
import {useRouter} from 'next/router';
import GalleryNurse from '../../../components/GalleryNurse';
import dayjs from 'dayjs';
import {AiOutlineDelete, AiOutlineEdit} from 'react-icons/ai';

export const dropzoneChildren = (rejected) => (
    <>
        {!rejected ? (
            <Group
                position="center"
                spacing="xl"
                style={{minHeight: 220, pointerEvents: 'none'}}
            >
                <div>
                    <Text size="xl" inline>
                        Glisser/déposer vos images, ou cliquez pour les
                        sélectionner
                    </Text>
                    <Text size="sm" color="dimmed" inline mt={7}>
                        Ajouter autant d&apos;images que vous voulez, tant
                        qu&apos;elle ne dépasse pas 5MB
                    </Text>
                </div>
            </Group>
        ) : (
            <Group
                position="center"
                spacing="xl"
                style={{minHeight: 220, pointerEvents: 'none'}}
            >
                <div>
                    <Text size="xl" inline>
                        Vous avez ajouté trop de fichiers (max. 5)
                    </Text>
                </div>
            </Group>
        )}
    </>
);

export const dropzoneChildrenUploaded = (files, rejected) => (
    <>
        {!rejected ? (
            <Group
                position="center"
                spacing="xl"
                style={{minHeight: 220, pointerEvents: 'none'}}
            >
                <div>
                    <Text size="xl" inline>
                        {files.length > 1 ? (
                            <>{files.length} images ont été ajoutées</>
                        ) : (
                            <>{files.length} image a été ajoutée</>
                        )}
                    </Text>
                    <Text size="sm" color="dimmed" inline mt={7}>
                        Vous pouvez envoyer le formulaire
                    </Text>
                </div>
            </Group>
        ) : (
            <Group
                position="center"
                spacing="xl"
                style={{minHeight: 220, pointerEvents: 'none'}}
            >
                <div>
                    <Text size="xl" inline>
                        Vous avez ajouté trop de fichiers (max. 5)
                    </Text>
                </div>
            </Group>
        )}
    </>
);

function Feed({userId, bearer, feed}) {
    const [value, onChange] = useState(
        '<p>Racontez les activités effectuer par les enfants</p>'
    );
    const [uploaded, setUploaded] = useState(false);
    const [images, setImages] = useState([]);
    const [rejected, setRejected] = useState(false);
    const [opened, setOpened] = useState(false);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [feedId, setFeedId] = useState();
    const [feedText, setFeedText] = useState();
    const [isLoading, setLoading] = useState(false);

    const router = useRouter();

    function createMarkup(text) {
        return {
            __html: text,
        };
    }

    const refreshData = () => {
        router.replace(router.asPath);
    };

    const send = async (event) => {
        event.preventDefault();
        setLoading(true)
        const data = new FormData();
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}feed/${userId}`, {
            body: JSON.stringify({
                text: value,
            }),
            method: 'POST',
            headers: {
                Authorization: bearer,
            },
        })

        const feedId = await res.json();

        const result = [];
        if (images.length > 0) {
            images.forEach((photo, idx, array) => {
                data.append('file', photo);
                data.append('upload_preset', 'eekmglxg');
                data.append('folder', `nurseen/feed/${feedId}`);
                result [idx] = fetch(
                    'https://api.cloudinary.com/v1_1/devmathias/image/upload',
                    {
                        method: 'POST',
                        body: data,
                    }
                )
                    .then((response) => {
                        return response.json();
                    })
            });

            Promise.all(result).then((values) => {
                fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}feed/${feedId}/images`,
                    {
                        body: JSON.stringify(values),
                        method: 'POST',
                        headers: {
                            Authorization: bearer,
                        },
                    }
                ).then(() => {
                    onChange(
                        '<p>Racontez les activités effectuer par les enfants</p>'
                    );
                    setImages([]);
                    setUploaded(false);
                    setLoading(false);
                    refreshData();
                });
            })

        }

    };

    const update = (event) => {
        event.preventDefault();

        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}feed/${feedId}`, {
            body: JSON.stringify({
                text: feedText,
            }),
            method: 'PATCH',
            headers: {
                Authorization: bearer,
            },
        }).then(() => {
            onChange('<p>Racontez les activités effectuer par les enfants</p>');
            setImages([]);
            setUploaded(false);
            setOpenDrawer(false);
            refreshData();
        });
    };

    const deleteFeed = (event) => {
        event.preventDefault();
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}feed/${feedId}`, {
            method: 'DELETE',
            headers: {
                Authorization: bearer,
            },
        }).then(() => {
            setOpened(false);
            refreshData();
        });
    };

    return (
        <>
            <LoadingOverlay visible={isLoading} />
            <Drawer
                opened={openDrawer}
                onClose={() => setOpenDrawer(false)}
                title="Modification du post"
                padding="xl"
                size="xl"
            >
                {
                    <form onSubmit={update}>
                        <RichTextEditor
                            placeholder="Résumer en quelques phrases la journée d'un enfant"
                            value={feedText}
                            onChange={setFeedText}
                            controls={[
                                ['bold', 'italic', 'underline', 'link'],
                                ['unorderedList', 'h1', 'h2', 'h3'],
                                ['sup', 'sub'],
                                ['alignLeft', 'alignCenter', 'alignRight'],
                            ]}
                        />
                        <Space h={'xl'}/>
                        <Button
                            type="submit"
                            size={'md'}
                            style={{
                                backgroundColor: '#4ad4c6',
                                float: 'right',
                            }}
                            disabled={rejected}
                        >
                            Envoyez
                        </Button>
                    </form>
                }
            </Drawer>
            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                title={'Etes vous sur de vouloir supprimer ce post ?'}
            >
                {
                    <>
                        <Center>
                            <Group>
                                <Button color="red" onClick={deleteFeed}>
                                    Supprimer
                                </Button>
                                <Button onClick={() => setOpened(false)}>
                                    Annuler
                                </Button>
                            </Group>
                        </Center>
                    </>
                }
            </Modal>
            <Title>Donnez des nouvelles des enfants aux parents</Title>
            <Space h={'xl'}/>
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
                <Space h={'xl'}/>
                <Accordion>
                    <Accordion.Item label="Ajouter des photos (max. 5)">
                        <Dropzone
                            onDrop={(files) => {
                                setRejected(false);
                                setImages(files);
                                setUploaded(true);
                                if (files.length > 5) {
                                    setRejected(true);
                                }
                            }}
                            onReject={(files) =>
                                console.log('rejected files', files)
                            }
                            accept={IMAGE_MIME_TYPE}
                        >
                            {uploaded
                                ? () =>
                                    dropzoneChildrenUploaded(images, rejected)
                                : () => dropzoneChildren(rejected)}
                        </Dropzone>
                    </Accordion.Item>
                </Accordion>
                <Space h={'xl'}/>
                <Button
                    type="submit"
                    size={'md'}
                    style={{backgroundColor: '#4ad4c6', float: 'right'}}
                    disabled={rejected}
                >
                    Envoyez
                </Button>
            </form>
            <Space h={'xl'}/>
            <Space h={'xl'}/>
            <Space h={'xl'}/>
            {feed &&
            feed.map((f, idf) => (
                <div key={idf}>
                    <div
                        style={{
                            backgroundColor: '#edf2f4',
                            padding: '16px',
                            borderRadius: '8px',
                        }}
                    >
                        <Group position="right">
                            <Button
                                style={{
                                    marginleft: 'auto',
                                    marginRight: 0,
                                }}
                                color="red"
                                onClick={() => {
                                    setFeedId(f.id);
                                    setOpened(true);
                                }}
                            >
                                <AiOutlineDelete size={25}/>
                            </Button>
                            <Button
                                onClick={() => {
                                    setFeedId(f.id);
                                    setFeedText(f.text);
                                    setOpenDrawer(true);
                                }}
                            >
                                <AiOutlineEdit size={25}/>
                            </Button>
                        </Group>
                        <Text>
                            {f.nurse.nurse.firstname +
                            ' ' +
                            f.nurse.nurse.lastname +
                            ' - ' +
                            dayjs(f.creationDate).format('DD MMM YYYY')}
                        </Text>

                        <Text
                            dangerouslySetInnerHTML={createMarkup(f.text)}
                        />
                        <GalleryNurse
                            galleryPhoto={f.feedImages.map((i) => ({
                                src: `${process.env.NEXT_PUBLIC_MEDIA_URL}/${i.url}`,
                                width: 2,
                                height: 3,
                            }))}
                            bearer={bearer}
                        />
                    </div>
                    <Space h={'xl'}/>
                </div>
            ))}
        </>
    );
}

export default Feed;

export async function getServerSideProps(ctx) {
    const sessionCallBack = await getSession(ctx);

    const authToken = new AuthToken(sessionCallBack.user.access_token);

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}feed/${authToken.decodedToken.id}`,
        {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                Authorization: authToken.authorizationString,
            },
        }
    );

    const feed = await res.json();

    return {
        props: {
            userId: sessionCallBack.user.id,
            bearer: authToken.authorizationString,
            feed,
        },
    };
}
