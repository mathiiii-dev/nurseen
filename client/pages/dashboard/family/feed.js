import { Button, Space, Text, Title } from '@mantine/core';
import { getSession } from 'next-auth/react';
import { AuthToken } from '../../../services/auth_token';
import GalleryNurse from '../../../components/GalleryNurse';
import dayjs from 'dayjs';
import Link from 'next/link';

function Feed({ feed }) {
    function createMarkup(text) {
        return {
            __html: text,
        };
    }

    return (
        <>
            {feed.length > 0 ? (
                <>
                    <Title>Les actualités de vos enfants</Title>
                    <Space h={'xl'} />
                    {feed.map((f) => (
                        <>
                            <div
                                style={{
                                    backgroundColor: '#edf2f4',
                                    padding: '16px',
                                    borderRadius: '8px',
                                }}
                            >
                                <Text>
                                    {f.nurse.nurse.firstname +
                                        ' ' +
                                        f.nurse.nurse.lastname +
                                        ' - ' +
                                        dayjs(f.creationDate).format(
                                            'DD MMM YYYY'
                                        )}
                                </Text>
                                <Text
                                    dangerouslySetInnerHTML={createMarkup(
                                        f.text
                                    )}
                                />
                                <GalleryNurse
                                    galleryPhoto={f.feedImages.map((i) => ({
                                        src: `${process.env.MEDIA_URL}/feed/${f.id}/${i.url}`,
                                        width: 2,
                                        height: 3,
                                    }))}
                                />
                            </div>
                            <Space h={'xl'} />
                        </>
                    ))}
                </>
            ) : (
                <>
                    <Text>
                        Vous devez enregistrer au moins un enfant pour voir
                        apparaitre les posts sur l'actualité
                    </Text>
                    <Link href={'create-kid'}>
                        <Button>Ajouter un enfant</Button>
                    </Link>
                </>
            )}
        </>
    );
}

export default Feed;

export async function getServerSideProps(ctx) {
    const sessionCallBack = await getSession(ctx);

    const authToken = new AuthToken(sessionCallBack.user.access_token);

    const res = await fetch(
        process.env.BASE_URL + `feed/family/${authToken.decodedToken.id}`,
        {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                Authorization: authToken.authorizationString,
            },
        }
    );

    const feed = await res.json();

    return {
        props: {
            userId: sessionCallBack.user.id,
            bearer: authToken.authorizationString,
            feed,
        },
    };
}
