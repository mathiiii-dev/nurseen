import { useCallback, useEffect, useState } from 'react';
import { AuthToken } from '../../../../services/auth_token';
import { getSession } from 'next-auth/react';
import Gallery from 'react-photo-gallery';
import Carousel, { Modal, ModalGateway } from 'react-images';
import {
    ActionIcon,
    Button,
    Center,
    Divider,
    Group,
    LoadingOverlay,
    Pagination,
    Space,
    Text,
} from '@mantine/core';
import { AiOutlineClose, AiTwotoneDelete } from 'react-icons/ai';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { usePagination } from '@mantine/hooks';

function AddGallery({ bearer, userId }) {
    const [currentImage, setCurrentImage] = useState(0);
    const [viewerIsOpen, setViewerIsOpen] = useState(false);
    const [photos, setPhotos] = useState([]);
    const router = useRouter();
    const [isLoading, setLoading] = useState(false);
    const [page, onChange] = useState(1);
    const [total, setTotal] = useState(1);
    const pagination = usePagination({ total, page, onChange });

    useEffect(() => {
        setLoading(true);
        fetch(process.env.BASE_URL + `gallery/nurse/${userId}?page=${page}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                Authorization: bearer,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setLoading(false);
                setPhotos(data.items);
                setTotal(data.pagination.total_pages);
            });
    }, [page]);

    let galleryPhoto = [];
    if (photos.length !== 0) {
        galleryPhoto = photos.map((element) => ({
            id: element.id,
            src:
                process.env.MEDIA_URL + 'gallery/' + userId + '/' + element.url,
            width: 4,
            height: 3,
        }));
    }

    const openLightbox = useCallback((event, { photo, index }) => {
        setCurrentImage(index);
        setViewerIsOpen(true);
    }, []);

    const closeLightbox = () => {
        setCurrentImage(0);
        setViewerIsOpen(false);
    };

    const deleteImage = async () => {
        const res = await fetch(
            process.env.BASE_URL + `gallery/${galleryPhoto[currentImage].id}`,
            {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: bearer,
                },
            }
        );

        if (res.status === 204) {
            router.reload();
        }
    };

    const CustomHeader = ({ innerProps, isModal }) =>
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
                        <AiTwotoneDelete size={25} />
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
                        <AiOutlineClose size={25} />
                    </ActionIcon>
                </Group>
            </div>
        ) : null;

    return (
        <div>
            <LoadingOverlay visible={isLoading} />
            <Link href={'gallery/add'}>
                <Button>Ajouter des photos</Button>
            </Link>
            <Space h={'xl'} />
            {galleryPhoto && galleryPhoto.length === 0 ? (
                ''
            ) : (
                <>
                    <Gallery photos={galleryPhoto} onClick={openLightbox} />
                    <ModalGateway>
                        {viewerIsOpen ? (
                            <Modal onClose={closeLightbox}>
                                <Carousel
                                    components={{ Header: CustomHeader }}
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
            {galleryPhoto && galleryPhoto.length === 0 ? (
                ''
            ) : (
                <>
                    <Space h={'xl'} />
                    <Center>
                        <Pagination total={total} onChange={onChange} />
                    </Center>
                    <Space h={'xl'} />
                </>
            )}
        </div>
    );
}

export default AddGallery;

export async function getServerSideProps(ctx) {
    const sessionCallBack = await getSession(ctx);

    const authToken = new AuthToken(sessionCallBack.user.access_token);

    return {
        props: {
            userId: sessionCallBack.user.id,
            bearer: authToken.authorizationString,
        },
    };
}
