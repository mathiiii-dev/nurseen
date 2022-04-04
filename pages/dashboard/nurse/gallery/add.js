import {Group, Text, useMantineTheme, MantineTheme, Space, Button, Title} from '@mantine/core';
import {Upload, Photo, X, Icon as TablerIcon} from 'tabler-icons-react';
import {Dropzone, DropzoneStatus, IMAGE_MIME_TYPE} from '@mantine/dropzone';
import {getServerSideProps} from "./../index";
import {useState} from "react";

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

export const dropzoneChildren = (status, theme) => (
    <Group position="center" spacing="xl" style={{minHeight: 220, pointerEvents: 'none'}}>
        <ImageUploadIcon status={status} style={{color: getIconColor(status, theme)}} size={80}/>
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
        <ImageUploadIcon status={status} style={{color: getIconColor(status, theme)}} size={80}/>
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

function AddGallery({bearer, userId}) {

    const theme = useMantineTheme();
    const [files, setFiles] = useState(null);
    const [uploaded, setUploaded] = useState(false);

    const upload = (event) => {
        event.preventDefault()
        const data = new FormData();
        if (files) {
            console.log(files)
            files.forEach(
                photo => {
                    data.append(photo.name, photo);
                }
            )
        }
        fetch(`http://localhost:8010/proxy/api/gallery/${userId}`, {
            body: data,
            method: 'POST',
            headers: {
                'Authorization': bearer
            }

        })
            .then((response) => response.json())
    }


return (
    <>
        <Title>Ajouter des images à la gallerie</Title>
        <Space h={"xl"}/>
        <form onSubmit={upload}>
            <Dropzone
                onDrop={(files) => {
                    setFiles(files)
                    setUploaded(true)
                }}
                onReject={(files) => console.log('rejected files', files)}
                maxSize={3 * 1024 ** 2}
                accept={IMAGE_MIME_TYPE}
            >
                {uploaded ?
                    (status) => dropzoneChildrenUploaded(status, theme, files)
                    :
                    (status) => dropzoneChildren(status, theme)
                }
            </Dropzone>
            <Space h={"xl"}/>
            <Button fullWidth type="submit">Ajouter</Button>
        </form>
    </>
);
}

export default AddGallery;

export {getServerSideProps};
