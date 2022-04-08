import {useCallback, useEffect, useState} from "react";
import {AuthToken} from "../../../services/auth_token";
import {getSession} from "next-auth/react";
import Gallery from "react-photo-gallery";
import Carousel, {Modal, ModalGateway} from "react-images";
import {Center, LoadingOverlay, Pagination, Space} from "@mantine/core";
import {usePagination} from "@mantine/hooks";

function AddGallery({bearer, userId}) {

    const [currentImage, setCurrentImage] = useState(0);
    const [viewerIsOpen, setViewerIsOpen] = useState(false);
    const [photos, setPhotos] = useState([]);
    const [isLoading, setLoading] = useState(false)
    const [page, onChange] = useState(1);
    const [total, setTotal] = useState(1);
    const pagination = usePagination({ total, page, onChange });

    useEffect( () => {
        setLoading(true)
        fetch(process.env.BASE_URL + `gallery/family/${userId}?page=${page}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': bearer
            }
        }).then((res) => res.json())
            .then((data) => {
                setLoading(false)
                setPhotos(data.items)
                setTotal(data.pagination.total_pages)
            })

    }, [page])

    let galleryPhoto = [];
    if (photos.length !== 0) {
        galleryPhoto = photos.map(
            (element) => (
                {
                    src: process.env.MEDIA_URL + element.nurse.nurse.id + '/' + element.url,
                    width: 4,
                    height: 3,
                }
            ))
    }

    const openLightbox = useCallback((event, {photo, index}) => {
        setCurrentImage(index);
        setViewerIsOpen(true);
    }, []);

    const closeLightbox = () => {
        setCurrentImage(0);
        setViewerIsOpen(false);
    };


    return (
        <div>
            <LoadingOverlay visible={isLoading} />
            <Space h={"xl"}/>
            {
                galleryPhoto && galleryPhoto.length === 0 ?
                    ''
                    :
                    <>
                        <Gallery photos={galleryPhoto} onClick={openLightbox}/>
                        <ModalGateway>
                            {viewerIsOpen ?
                                (
                                    <Modal onClose={closeLightbox}>
                                        <Carousel
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
            <Space h={"xl"}/>
            <Center>
                <Pagination total={total} onChange={onChange}/>
            </Center>
            <Space h={"xl"}/>
        </div>
    )
}

export default AddGallery;

export async function getServerSideProps(ctx) {

    const sessionCallBack = await getSession(ctx);

    const authToken = new AuthToken(sessionCallBack.user.access_token);

    return {
        props:
            {
                userId: sessionCallBack.user.id,
                bearer: authToken.authorizationString
            }
    }
}
