import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import {useEffect, useState} from "react";
import {Alert, Button, Modal, Select, Space} from '@mantine/core'
import {privateRoute} from "../../../../../components/privateRoute";
import {DatePicker, TimeRangeInput} from "@mantine/dates";
import dayjs from "dayjs";
import {useNotifications} from "@mantine/notifications";


function Full({auth}) {

    useEffect(() => {
        fetch(`http://localhost:8010/proxy/api/calendar/nurse/${auth.decodedToken.id}`,
            {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': auth.authorizationString
                }
            })
            .then((res) => res.json())
            .then((data) => {
                setDataCalendar(data)
            })

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
                setData(data)
            })
    }, [])

    const [opened, setOpened] = useState(false);
    const now = new Date();
    const then = dayjs(now).add(8, 'hours').toDate();
    const [timeRanges, setTimeRanges] = useState([now, then]);
    const [data, setData] = useState('');
    const [dataCalendar, setDataCalendar] = useState(null);
    const [select, setSelect] = useState(null);
    const [day, setDay] = useState(null);
    const [showError, setShowError] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const notifications = useNotifications();


    if(select) {
        console.log(select)
    }

    let events = null;
    if (dataCalendar) {
        events = dataCalendar.map((element) => (
            {
                id: element.kid_id,
                title: element.firstname + ' ' + element.lastname,
                start: element.day + ' ' + element.arrival,
                end: element.day + ' ' + element.departure
            }
        ))
    }

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
        ).then(async r => {
            if (r.status !== 201) {
                const res = await r.json()
                setShowError(true)
                setErrorMessage(res.error_description)
            } else {
                setOpened(false)
                notifications.showNotification({
                    title: 'Enfant enregistré',
                    message: 'Il va maintenant apparaitre dans votre calendrier',
                    color: 'teal'
                })
            }
        })
    }

    return (
        <>
            <Modal
                opened={editModal}
                onClose={() => setEditModal(false)}
                title="Modifier ou supprimer le jour d'un enfant"
            >
                <Button fullWidth color="red">Supprimer</Button>
                <Space h={"xl"}/>
                {
                    showError ?
                        <>
                            <Alert title="Erreur!" color="red">
                                {errorMessage}
                            </Alert>
                            <Space h="xl"/>
                        </>
                        : ''
                }
                {
                    <form>
                        <DatePicker
                            placeholder="Choisir une date"
                            label="Jour de présence"
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
                            label="Enfant"
                            placeholder="Choisir un enfant"/>
                        <Space h={"xl"}/>
                        <Button type="submit"
                                style={{backgroundColor: '#4ad4c6', float: 'right'}}
                        >
                            Modifier
                        </Button>
                    </form>
                }
            </Modal>
            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                title="Enregistrer un jour pour un enfant"
            >
                {
                    showError ?
                        <>
                            <Alert title="Erreur!" color="red">
                                {errorMessage}
                            </Alert>
                            <Space h="xl"/>
                        </>
                        : ''
                }
                {
                    <form onSubmit={calendar}>
                        <DatePicker
                            placeholder="Choisir une date"
                            label="Jour de présence"
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
                            label="Enfant"
                            placeholder="Choisir un enfant"/>
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
                dateClick={(e) => {
                    e.view.calendar.changeView('timeGridDay', e.dateStr)
                }}
                eventClick={(e) => {
                    setDay(e.event.start)
                    setTimeRanges([e.event.start, e.event.end])
                    setSelect(e.event.id)
                    setEditModal(true)
                }}
                timeZone='UTC'
                locale='fr'
            />
        </>
    );
}

export default privateRoute(Full);