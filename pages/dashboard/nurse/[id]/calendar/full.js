import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import {useEffect, useState} from "react";
import {Button, Modal, Select, Space} from '@mantine/core'
import {privateRoute} from "../../../../../components/privateRoute";
import {DatePicker, TimeRangeInput} from "@mantine/dates";
import dayjs from "dayjs";
import {useForm} from "@mantine/hooks";


function Full({auth}) {

    useEffect(() => {
        fetch(`http://localhost:8010/proxy/api/kid/nurse/${auth.decodedToken.id}`,
            {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': auth.authorizationString
                }
            })
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
                setData(data)
            })
    }, [])

    const events = [
        {
            id: 1,
            title: 'event 1',
            start: '2021-06-14T10:00:00',
            end: '2021-06-14T12:00:00',
        },
        {
            id: 2,
            title: 'event 2',
            start: '2021-06-16T13:00:00',
            end: '2021-06-16T18:00:00',
        },
        {
            id: 3,
            title: 'event 3',
            start: '2021-06-17',
            end: '2021-06-20'
        },
    ];
    const [opened, setOpened] = useState(false);
    const now = new Date();
    const then = dayjs(now).add(8, 'hours').toDate();
    const [timeRanges, setTimeRanges] = useState([now, then]);
    const [data, setData] = useState('');
    const [select, setSelect] = useState(null);
    const [day, setDay] = useState(null);

    let kids = null;
    if (data) {
        kids = data.map((element) => (
            {
                value: element.id,
                label: element.firstname + ' ' + element.lastname
            }
        ))
    }

    const calendar = async (event) => {
        event.preventDefault()
        fetch(
            `http://localhost:8010/proxy/api/calendar/kid/${select}`,
            {
                method: 'POST',
                body: JSON.stringify({
                    day,
                    timeRanges
                }),
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': auth.authorizationString
                }
            }
        ).then(r => console.log(r.json))
    }


    return (
        <>
            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                title="Introduce yourself!"
            >
                {
                    <form onSubmit={calendar}>
                        <DatePicker
                            placeholder="Pick date"
                            label="Event date"
                            value={day}
                            onChange={setDay}
                            required/>
                        <Space h={"xl"}/>
                        <TimeRangeInput
                            label="Horaires de présence"
                            value={timeRanges}
                            onChange={setTimeRanges}
                            clearable/>
                        <Space h={"xl"}/>
                        <Select
                            value={select}
                            onChange={setSelect}
                            data={kids}
                            label="Your favorite framework/library"
                            placeholder="Pick one"/>
                        <Space h={"xl"}/>
                        <Button type="submit"
                                style={{backgroundColor: '#4ad4c6', float: 'right'}}
                        >
                            Enregistrer
                        </Button>
                    </form>
                }
            </Modal>
            <FullCalendar
                buttonText={{
                    today: 'Aujourd\'hui',
                    month: 'Mois',
                    week: 'Semaine',
                    day: 'Jour',
                }}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                    center: 'dayGridMonth,timeGridWeek,timeGridDay new',
                }}
                customButtons={{
                    new: {
                        text: 'Nouveau',
                        click: () => setOpened(true),
                    },
                }}
                events={events}
                dateClick={(e) => console.log(e.dateStr)}
                eventClick={(e) => console.log(e.event.id)}
                timeZone='UTC'
                locale='fr'
            />
        </>
    );
}

export default privateRoute(Full);