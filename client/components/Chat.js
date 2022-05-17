import { Button, ScrollArea, Space, Text, Textarea } from '@mantine/core';
import dayjs from 'dayjs';
import { useState } from 'react';
import { scrollToBottom } from '../services/scroll';

function Chat({ userId, messages, viewport, bearer, cid }) {
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
                console.log(res);
                scrollToBottom(viewport);
            });
    };
    return (
        <>
            <ScrollArea viewportRef={viewport} style={{ height: 250 }}>
                {!messages.error
                    ? messages.map(function (d, idx) {
                          if (d.user.id === userId) {
                              return (
                                  <Text key={idx}>
                                      {d.sendDate +
                                          ' ' +
                                          d.user.lastname +
                                          ' ' +
                                          d.user.firstname +
                                          ' ' +
                                          d.message}
                                  </Text>
                              );
                          }
                          return (
                              <Text
                                  key={idx}
                                  style={{
                                      color: 'pink',
                                  }}
                              >
                                  {d.sendDate +
                                      ' ' +
                                      d.user.lastname +
                                      ' ' +
                                      d.user.firstname +
                                      ' ' +
                                      d.message}
                              </Text>
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
