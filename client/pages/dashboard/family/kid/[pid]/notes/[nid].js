import {useRouter} from 'next/router';
import {Button, SimpleGrid, Text} from '@mantine/core';
import {getSession} from 'next-auth/react';
import {AuthToken} from '../../../../../../services/auth_token';

function Note({note}) {
    const router = useRouter();

    return (
        <>
            <Button type="button" onClick={() => router.back()}>
                Retour
            </Button>
            {note ? (
                <SimpleGrid cols={1}>
                    <div>
                        <Text align={'justify'} dangerouslySetInnerHTML={{__html: note.note}}/>
                    </div>
                </SimpleGrid>
            ) : (
                ''
            )}
        </>
    );
}

export default Note;

export async function getServerSideProps(ctx) {
    const sessionCallBack = await getSession(ctx);

    const authToken = new AuthToken(sessionCallBack.user.access_token);

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}note/${ctx.params.nid}`,
        {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                Authorization: authToken.authorizationString,
            },
        }
    );

    const note = await res.json();

    if (note.error) {
        return {
            notFound: true,
        };
    }

    return {
        props: {
            note,
        },
    };
}
