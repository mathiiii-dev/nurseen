import {Button, Group, LoadingOverlay, Space, Text, Title, useMantineTheme,} from '@mantine/core';
import {Photo, Upload, X} from 'tabler-icons-react';
import {Dropzone, IMAGE_MIME_TYPE} from '@mantine/dropzone';
import {getServerSideProps} from './../index';
import {useState} from 'react';
import {useRouter} from 'next/router';
import Link from 'next/link';

function getIconColor(status, theme) {
    return status.accepted
        ? theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6]
        : status.rejected
            ? theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]
            : theme.colorScheme === 'dark'
                ? theme.colors.dark[0]
                : theme.colors.gray[7];
}

function ImageUploadIcon({status, ...props}) {
    if (status.accepted) {
        return <Upload {...props} />;
    }

    if (status.rejected) {
        return <X {...props} />;
    }

    return <Photo {...props} />;
}

export const dropzoneChildren = (status, theme, rejected) => (
    <>{
        rejected ?
            <>
                <Group
                    position="center"
                    spacing="xl"
                    style={{minHeight: 220, pointerEvents: 'none', border: 'pink 2 px solid'}}
                >
                    <ImageUploadIcon
                        status={status}
                        style={{color: getIconColor(status, theme)}}
                        size={80}
                    />
                    <div>
                        <Text size="xl" inline>
                            Une de vos images a été rejetée.
                        </Text>
                        <Text size="sm" color="dimmed" inline mt={7}>
                            Veuillez vérifier sa taille, elle ne doit pas dépassée 5MB
                        </Text>
                    </div>
                </Group>
            </> :
            <>
                <Group
                    position="center"
                    spacing="xl"
                    style={{minHeight: 220, pointerEvents: 'none'}}
                >
                    <ImageUploadIcon
                        status={status}
                        style={{color: getIconColor(status, theme)}}
                        size={80}
                    />
                    <div>
                        <Text size="xl" inline>
                            Glisser/déposer vos images, ou cliquez pour les sélectionner
                        </Text>
                        <Text size="sm" color="dimmed" inline mt={7}>
                            Ajouter autant d'images que vous voulez, tant qu'elle ne dépasse
                            pas 5MB
                        </Text>
                    </div>
                </Group>
            </>
    }</>

);

export const dropzoneChildrenUploaded = (status, theme, files, rejected) => (
    <>{
        rejected ?
            <>
                <Group
                    position="center"
                    spacing="xl"
                    style={{minHeight: 220, pointerEvents: 'none', border: 'pink 2 px solid'}}
                >
                    <ImageUploadIcon
                        status={status}
                        style={{color: getIconColor(status, theme)}}
                        size={80}
                    />
                    <div>
                        <Text size="xl" inline>
                            Une de vos images a été rejetée.
                        </Text>
                        <Text size="sm" color="dimmed" inline mt={7}>
                            Veuillez vérifier sa taille, elle ne doit pas dépassée 5MB
                        </Text>
                    </div>
                </Group>
            </> :
            <>
                <Group
                    position="center"
                    spacing="xl"
                    style={{minHeight: 220, pointerEvents: 'none'}}
                >
                    <ImageUploadIcon
                        status={status}
                        style={{color: getIconColor(status, theme)}}
                        size={80}
                    />
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
            </>
    }</>

);

function AddGallery({bearer, userId}) {
    const theme = useMantineTheme();
    const [files, setFiles] = useState(null);
    const [uploaded, setUploaded] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [rejected, setRejected] = useState(false);
    const router = useRouter();

    const upload = (event) => {
        event.preventDefault();
        const data = new FormData();
        if (files) {
            files.forEach((photo) => {
                data.append(photo.name, photo);
            });
        }

        if (files) {
            const result = [];
            files.forEach((photo, idx) => {
                const data = new FormData();
                data.append('file', photo);
                data.append('upload_preset', 'eekmglxg');
                data.append('folder', `nurseen/gallery/${userId}`);
                setLoading(true);
                result[idx] = fetch(
                    process.env.NEXT_PUBLIC_CLOUDINARY_MEDIA_API_URL,
                    {
                        method: 'POST',
                        body: data,
                    }
                )
                    .then((response) => {
                        if (response.ok) {
                            return response.json();
                        }
                    })
            });

            Promise.all(result).then((values) => {
                fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}gallery/${userId}`,
                    {
                        body: JSON.stringify(values),
                        method: 'POST',
                        headers: {
                            Authorization: bearer,
                        },
                    }
                ).then(() => {
                    setLoading(false);
                    router.push('/dashboard/nurse/gallery');
                });
            });

        }
    };

    return (
        <>
            <Title>Ajouter des images à la gallerie</Title>
            <Space h={'xl'}/>
            <Link href={'/dashboard/nurse/gallery'}>
                <Button>Retour Gallerie</Button>
            </Link>
            <Space h={'xl'}/>

            <LoadingOverlay visible={isLoading} overlayOpacity={100}/>
            <form onSubmit={upload}>
                <Dropzone
                    onDrop={(files) => {
                        setRejected(false);
                        setFiles(files);
                        setUploaded(true);
                    }}
                    onReject={(files) => {
                        setRejected(true)
                    }}
                    maxSize={3 * 1024 ** 2}
                    accept={IMAGE_MIME_TYPE}
                >
                    {uploaded
                        ? (status) =>
                            dropzoneChildrenUploaded(status, theme, files, rejected)
                        : (status) => dropzoneChildren(status, theme, rejected)}
                </Dropzone>
                <Space h={'xl'}/>
                <Button fullWidth type="submit" disabled={rejected}>
                    Ajouter
                </Button>
            </form>
        </>
    );
}

export default AddGallery;

export {getServerSideProps};
