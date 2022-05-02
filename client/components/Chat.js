import {ScrollArea, Text} from "@mantine/core";

function Chat({userId, messages, viewport}) {
    console.log(messages)
    return (
        <>
            <ScrollArea viewportRef={viewport} style={{height: 250}}>
                {!messages.error ? messages.map(function (d, idx) {
                    if (d.user.id === userId) {
                        return (
                            <Text
                                key={idx}>{d.sendDate.toString() + ' ' + d.user.lastname + ' ' + d.user.firstname + ' ' + d.message}</Text>
                        )
                    }
                    return <Text key={idx} style={{
                        color: 'pink',
                    }
                    }>{d.sendDate.toString() + ' ' + d.user.lastname + ' ' + d.user.firstname + ' ' + d.message}</Text>
                }) : ''}
            </ScrollArea>
        </>
    );
}

export default Chat;
