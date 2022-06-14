import Gallery from 'react-photo-gallery';
import Carousel, {Modal, ModalGateway} from 'react-images';
import {
    ActionIcon,
    Divider,
    Group
} from '@mantine/core';
import {useCallback, useState} from 'react';
import {AiOutlineClose, AiTwotoneDelete} from 'react-icons/ai';
import {useRouter} from 'next/router';

export default function GalleryNurse({
                                         galleryPhoto,
                                         bearer,
                                         gallery = false,
                                     }) {
    const [currentImage, setCurrentImage] = useState(0);
    const [viewerIsOpen, setViewerIsOpen] = useState(false);
    const router = useRouter();

    const openLightbox = useCallback((event, {index}) => {
        setCurrentImage(index);
        setViewerIsOpen(true);
    }, []);
    const closeLightbox = () => {
        setCurrentImage(0);
        setViewerIsOpen(false);
    };

    const deleteImage = async () => {
        fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}gallery/${galleryPhoto[currentImage].id}`,
            {
                method: 'DELETE',
                body: JSON.stringify({
                    public_id: galleryPhoto[currentImage].public_id
                }),
                headers: {
                    'Content-type': 'application/json',
                    Authorization: bearer,
                },
            }
        ).then((res) => {
            if (res.status === 204) {
                router.reload();
            }
        });
    };

    const CustomHeader = ({isModal}) =>
        isModal ? (
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
                        variant="filled"
                    >
                        <AiTwotoneDelete size={25}/>
                    </ActionIcon>
                    <Divider
                        size="xl"
                        orientation={'vertical'}
                        variant={'solid'}
                    />
                    <ActionIcon
                        onClick={closeLightbox}
                        color="gray"
                        size="xl"
                        radius="xs"
                        variant="filled"
                    >
                        <AiOutlineClose size={25}/>
                    </ActionIcon>
                </Group>
            </div>
        ) : null;

    return (
        <>
            {galleryPhoto && galleryPhoto.length === 0 ? (
                ''
            ) : (
                <>
                    <Gallery photos={galleryPhoto} onClick={openLightbox}/>
                    <ModalGateway>
                        {viewerIsOpen ? (
                            <Modal onClose={closeLightbox}>
                                <Carousel
                                    components={
                                        gallery && {Header: CustomHeader}
                                    }
                                    currentIndex={currentImage}
                                    views={galleryPhoto.map((x) => ({
                                        ...x,
                                        srcset: x.srcSet,
                                        caption: x.title,
                                    }))}
                                />
                            </Modal>
                        ) : null}
                    </ModalGateway>
                </>
            )}
        </>
    );
}
