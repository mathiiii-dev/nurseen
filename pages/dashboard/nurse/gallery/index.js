import {useCallback, useState} from "react";
import {AuthToken} from "../../../../services/auth_token";
import {getSession} from "next-auth/react";
import Gallery from "react-photo-gallery";
import Carousel, {Modal, ModalGateway} from "react-images";

function AddGallery({bearer, userId, galleryPhoto}) {

    console.log(galleryPhoto)
    const [currentImage, setCurrentImage] = useState(0);
    const [viewerIsOpen, setViewerIsOpen] = useState(false);
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
                                )}
                            />
                        </Modal>) : null}
            </ModalGateway>
        </div>
    )
}

export default AddGallery;

export async function getServerSideProps(ctx) {

    const sessionCallBack = await getSession(ctx);

    const authToken = new AuthToken(sessionCallBack.user.access_token);

    const res = await fetch(`http://localhost:8010/proxy/api/gallery/nurse/${authToken.decodedToken.id}`, {
        method: 'GET',
        headers: {'Content-type': 'application/json', 'Authorization': authToken.authorizationString}
    });

    const photos = await res.json();

    let galleryPhoto = null;
    if (photos) {
        galleryPhoto = photos.map(
            (element) => (
                {
                    src: "http://127.0.0.1:8887/" + authToken.decodedToken.id + '/' + element.url,
                    width: 3,
                    height: 3}
            ))
    }
    return {props: {userId: sessionCallBack.user.id, bearer: authToken.authorizationString, galleryPhoto}}
}
