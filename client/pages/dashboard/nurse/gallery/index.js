import { useEffect, useState } from 'react';
import { AuthToken } from '../../../../services/auth_token';
import { getSession } from 'next-auth/react';
import {
    Button,
    Center,
    LoadingOverlay,
    Pagination,
    Space,
} from '@mantine/core';
import GalleryNurse from '../../../../components/GalleryNurse';

import Link from 'next/link';
import { usePagination } from '@mantine/hooks';
import '../../../../styles/globals.css';

function AddGallery({ bearer, userId }) {
    const [photos, setPhotos] = useState([]);

    const [isLoading, setLoading] = useState(false);
    const [page, onChange] = useState(1);
    const [total, setTotal] = useState(1);
    const pagination = usePagination({ total, page, onChange });

    useEffect(() => {
        setLoading(true);
        fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}gallery/nurse/${userId}?page=${page}`,
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
            id: element.id,
            src:
                process.env.NEXT_PUBLIC_MEDIA_URL +
                'gallery/' +
                userId +
                '/' +
                element.url,
            sizes: ['(min-width: 480px) 50vw,(min-width: 1024px) 33.3vw,100vw'],
            width: 3,
            height: 4,
        }));
    }

    return (
        <>
            <LoadingOverlay visible={isLoading} />
            <Link href={'gallery/add'}>
                <Button>Ajouter des photos</Button>
            </Link>
            <Space h={'xl'} />
            <GalleryNurse galleryPhoto={galleryPhoto} bearer={bearer} gallery />
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
        </>
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
