import {
    Avatar,
    Button,
    Grid,
    ScrollArea,
    Space,
    Text,
    Textarea,
} from '@mantine/core';
import dayjs from 'dayjs';
import { useState } from 'react';
import { scrollToBottom } from '../services/scroll';

function Chat({ userId, messages, viewport, bearer, cid, height }) {
    const [value, setValue] = useState('');

    const send = (event) => {
        event.preventDefault();
        fetch(process.env.BASE_URL + `message/${cid}`, {
            method: 'POST',
            body: JSON.stringify({
                message: value,
                user: userId,
                sendDate: dayjs(),
            }),
            headers: {
                'Content-type': 'application/json',
                Authorization: bearer,
            },
        })
            .then((r) => r.json())
            .then((res) => {
                setValue('');
                scrollToBottom(viewport);
            });
    };

    const getFirstChar = (str) => {
        return str.substring(0, 1);
    };

    return (
        <>
            <ScrollArea viewportRef={viewport} style={{ height: height }}>
                {!messages.error
                    ? messages.map(function (d, id) {
                          if (d.user.id === userId) {
                              return (
                                  <Grid
                                      key={id}
                                      style={{
                                          marginRight: 'auto',
                                          marginLeft: 0,
                                          width: '340px',
                                          marginTop: '10px',
                                          marginBottom: '10px',
                                      }}
                                  >
                                      <Grid.Col md={2} className={'hide'}>
                                          <Avatar color="cyan" radius="xl">
                                              {getFirstChar(d.user.firstname) +
                                                  ' ' +
                                                  getFirstChar(d.user.lastname)}
                                          </Avatar>
                                      </Grid.Col>
                                      <Grid.Col
                                          md={10}
                                          className={'wordWrap'}
                                          style={{
                                              backgroundColor: '#E4E6EB',
                                              borderRadius: '11px',
                                          }}
                                      >
                                          <Text>{d.message}</Text>
                                          <Text
                                              size={'xs'}
                                              style={{
                                                  float: 'right',
                                              }}
                                          >
                                              {dayjs(d.sendDate).format(
                                                  'HH:mm'
                                              )}
                                          </Text>
                                      </Grid.Col>
                                  </Grid>
                              );
                          }
                          return (
                              <Grid
                                  key={id}
                                  style={{
                                      marginLeft: 'auto',
                                      marginRight: 0,
                                      width: '340px',
                                      marginTop: '10px',
                                      marginBottom: '10px',
                                  }}
                              >
                                  <Grid.Col
                                      className={'wordWrap'}
                                      md={10}
                                      style={{
                                          backgroundColor: '#93FFD8',
                                          borderRadius: '11px',
                                      }}
                                  >
                                      <Text>{d.message}</Text>
                                      <Text
                                          size={'xs'}
                                          style={{
                                              float: 'right',
                                          }}
                                      >
                                          {dayjs(d.sendDate).format('HH:mm')}
                                      </Text>
                                  </Grid.Col>
                                  <Grid.Col md={2} className={'hide'}>
                                      <Avatar color="cyan" radius="xl">
                                          {getFirstChar(d.user.firstname) +
                                              ' ' +
                                              getFirstChar(d.user.lastname)}
                                      </Avatar>
                                  </Grid.Col>
                              </Grid>
                          );
                      })
                    : ''}
            </ScrollArea>
            <form onSubmit={send}>
                <Textarea
                    required
                    label="Message"
                    placeholder="Howdy!"
                    value={value}
                    onChange={(event) => setValue(event.currentTarget.value)}
                />
                <Space h={'md'} />
                <Button
                    type="submit"
                    style={{
                        float: 'right',
                    }}
                >
                    Submit
                </Button>
            </form>
        </>
    );
}

export default Chat;
