import React, { useEffect, useState } from 'react';
import { AuthToken } from '../../../services/auth_token';
import { getSession } from 'next-auth/react';
import Carousel, { Modal, ModalGateway } from 'react-images';
import {Button, Center, Image, LoadingOverlay, Pagination, SimpleGrid, Space, Text} from '@mantine/core';
import { usePagination } from '@mantine/hooks';
import GalleryNurse from '../../../components/GalleryNurse';
import NonKidsMessage from '../../../components/NoKidsMessage';
import Link from "next/link";

function AddGallery({ bearer, userId }) {
    const [currentImage, setCurrentImage] = useState(0);
    const [viewerIsOpen, setViewerIsOpen] = useState(false);
    const [photos, setPhotos] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [page, onChange] = useState(1);
    const [total, setTotal] = useState(1);
    const pagination = usePagination({ total, page, onChange });

    useEffect(() => {
        setLoading(true);
        fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}gallery/family/${userId}?page=${page}`,
            {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: bearer,
                },
            }
        )
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
            src: process.env.NEXT_PUBLIC_MEDIA_URL + element.url,
            width: 4,
            height: 3,
        }));
    }

    const closeLightbox = () => {
        setCurrentImage(0);
        setViewerIsOpen(false);
    };
    return (
        <div>
            <LoadingOverlay visible={isLoading} overlayOpacity={100} />
            <Space h={'xl'} />
            {galleryPhoto.kids ? (
                <NonKidsMessage
                    message={
                        'Vous devez enregistrer au moins un enfant pour voir les photos de la galerie'
                    }
                />
            ) : (
                <>
                    {
                        galleryPhoto.length !== 0 ? (
                            <>
                                <GalleryNurse galleryPhoto={galleryPhoto} bearer={bearer} />
                                <Space h={'xl'} />
                                <Center>
                                    <Pagination total={total} onChange={onChange} />
                                </Center>
                                <Space h={'xl'} />
                            </>
                        ) : (
                            <>
                                <SimpleGrid cols={1}>
                                    <Center>
                                        <Space h={"xl"}/>
                                        <div style={{width: 380, marginLeft: 'auto', marginRight: 'auto'}}>
                                            <Image
                                                radius="md"
                                                src="/img/undraw_empty_re_opql.svg"
                                                alt="Random unsplash image"
                                            />
                                        </div>
                                    </Center>
                                    <Center>
                                        <Text>
                                            La galerie ne comporte aucune image pour le moment
                                        </Text>
                                    </Center>
                                </SimpleGrid>
                            </>
                        )
                    }

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
