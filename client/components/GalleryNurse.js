import PhotoAlbum from "react-photo-album";
import {Lightbox} from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import {ActionIcon} from '@mantine/core';
import {useState} from 'react';
import {AiOutlineClose, AiTwotoneDelete} from 'react-icons/ai';
import {useRouter} from 'next/router';

export default function GalleryNurse({galleryPhoto, bearer, gallery = false,}) {
    const [currentImage, _] = useState(0);
    const router = useRouter();

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

    const [index, setIndex] = useState(-1);

    const slides = galleryPhoto.map(({src, width, height}) => ({
        src,
        aspectRatio: width / height,
    }));

    return (
        <>
            {galleryPhoto && galleryPhoto.length === 0 ? (
                ''
            ) : (
                <>
                    <PhotoAlbum
                        photos={galleryPhoto}
                        layout="columns"
                        targetRowHeight={150}
                        columns={3}
                        onClick={(event, photo, index) => setIndex(index)}
                    />
                    {gallery ?
                        <Lightbox toolbar={{
                            buttons: [<ActionIcon
                                onClick={deleteImage}
                                color="dark"
                                size="xl"
                                radius="xs"
                                variant="filled"
                            >
                                <AiTwotoneDelete size={25}/>
                            </ActionIcon>, <ActionIcon
                                onClick={() => setIndex(-1)}
                                color="dark"
                                size="xl"
                                radius="xs"
                                variant="filled"
                            >
                                <AiOutlineClose size={25}/>
                            </ActionIcon>]
                        }} slides={slides} open={index >= 0} index={index} close={() => setIndex(-1)}/>
                        :
                        <Lightbox slides={slides} open={index >= 0} index={index} close={() => setIndex(-1)}/>
                    }
                </>
            )}
        </>
    );
}
