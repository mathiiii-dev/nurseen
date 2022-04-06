import {useCallback, useState} from "react";
import {AuthToken} from "../../../../services/auth_token";
import {getSession} from "next-auth/react";
import Gallery from "react-photo-gallery";
import Carousel, {Modal, ModalGateway} from "react-images";
import {ActionIcon, Button, Divider, Group, Text} from "@mantine/core";
import {AiOutlineClose, AiTwotoneDelete} from "react-icons/ai";
import {useRouter} from "next/router";

function AddGallery({bearer, userId, galleryPhoto}) {

    const [currentImage, setCurrentImage] = useState(0);
    const [viewerIsOpen, setViewerIsOpen] = useState(false);
    const router = useRouter();

    const openLightbox = useCallback((event, {photo, index}) => {
        setCurrentImage(index);
        setViewerIsOpen(true);
    }, []);

    const closeLightbox = () => {
        setCurrentImage(0);
        setViewerIsOpen(false);
    };

    const deleteImage = async () => {
        const res = await fetch(`http://localhost:8010/proxy/api/gallery/${galleryPhoto[currentImage].id}`, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json',
                'Authorization': bearer
            }
        })

        if (res.status === 204) {
            router.reload();
        }
    }

    const CustomHeader = ({innerProps, isModal}) => isModal ? (
        <div
            style={{
                marginTop: 100,
                marginLeft: 50,
            }}
        >
            <Group>
                <ActionIcon
                    onClick={deleteImage}
                    color="gray"
                    size="xl"
                    radius="xs"
                    variant="filled">
                    <AiTwotoneDelete size={25}/>
                </ActionIcon>
                <Divider size="xl" orientation={"vertical"} variant={"solid"}/>
                <ActionIcon
                    onClick={closeLightbox}
                    color="gray"
                    size="xl"
                    radius="xs"
                    variant="filled">
                    <AiOutlineClose size={25}/>
                </ActionIcon>
            </Group>
        </div>
    ) : null;

    return (
        <div>
            {
                galleryPhoto.length === 0 ?
                    <Text>Aucunes photos d'enregistrées</Text>
                    :
                    <>
                        <Gallery photos={galleryPhoto} onClick={openLightbox}/>
                        <ModalGateway>
                            {viewerIsOpen ?
                                (
                                    <Modal onClose={closeLightbox}>
                                        <Carousel
                                            components={{Header: CustomHeader}}
                                            currentIndex={currentImage}
                                            views={galleryPhoto.map(x => (
                                                {
                                                    ...x,
                                                    srcset: x.srcSet,
                                                    caption: x.title
                                                })
                                            )}/>
                                    </Modal>
                                ) : null}
                        </ModalGateway>
                    </>
            }

        </div>
    )
}

export default AddGallery;

export async function getServerSideProps(ctx) {

    const sessionCallBack = await getSession(ctx);

    const authToken = new AuthToken(sessionCallBack.user.access_token);

    const res = await fetch(`http://localhost:8010/proxy/api/gallery/nurse/${authToken.decodedToken.id}`, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
            'Authorization': authToken.authorizationString
        }
    });

    const photos = await res.json();

    let galleryPhoto = null;
    if (photos) {
        galleryPhoto = photos.map(
            (element) => (
                {
                    id: element.id,
                    src: "http://127.0.0.1:8887/" + authToken.decodedToken.id + '/' + element.url,
                    width: 4,
                    height: 3,
                }
            ))
    }
    return {
        props:
            {
                userId: sessionCallBack.user.id,
                bearer: authToken.authorizationString,
                galleryPhoto
            }
    }
}
