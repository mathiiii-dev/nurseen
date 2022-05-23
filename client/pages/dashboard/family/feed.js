import { Space, Text, Title } from '@mantine/core';
import { getSession } from 'next-auth/react';
import { AuthToken } from '../../../services/auth_token';
import GalleryNurse from '../../../components/GalleryNurse';
import dayjs from 'dayjs';

function Feed({ feed }) {
    function createMarkup(text) {
        return {
            __html: text,
        };
    }

    console.log(feed);

    return (
        <>
            <Title>Les actualités de vos enfants</Title>
            <Space h={'xl'} />
            {feed
                ? feed.map((f) => (
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
                                  dangerouslySetInnerHTML={createMarkup(f.text)}
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
                  ))
                : ''}
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
    console.log(res);
    const feed = await res.json();
    console.log(feed);
    return {
        props: {
            userId: sessionCallBack.user.id,
            bearer: authToken.authorizationString,
            feed,
        },
    };
}
