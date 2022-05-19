import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useState } from 'react';
import { Alert, Button, Modal, Select, Space } from '@mantine/core';
import { DatePicker, TimeRangeInput } from '@mantine/dates';
import dayjs from 'dayjs';
import { useNotifications } from '@mantine/notifications';
import Router from 'next/router';
import { AuthToken } from '../../../services/auth_token';
import { getSession } from 'next-auth/react';

function Index({ bearer, kids, dayKidsCalendar }) {
    const [opened, setOpened] = useState(false);
    const now = new Date();
    const then = dayjs(now).add(8, 'hours').toDate();
    const [timeRanges, setTimeRanges] = useState([now, then]);
    const [select, setSelect] = useState(null);
    const [day, setDay] = useState(null);
    const [showError, setShowError] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [selectEvent, setSelectEvent] = useState('');
    const notifications = useNotifications();

    let events = null;
    if (dayKidsCalendar) {
        events = dayKidsCalendar.map((element) => ({
            id: element.kid_id,
            groupId: element.id,
            title: element.firstname + ' ' + element.lastname,
            start: element.day + ' ' + element.arrival,
            end: element.day + ' ' + element.departure,
        }));
    }

    let nurseKids = null;
    if (kids) {
        nurseKids = kids.map((element) => ({
            value: element.id.toString(),
            label: element.firstname + ' ' + element.lastname,
        }));
    }

    const calendar = async (event) => {
        event.preventDefault();
        fetch(process.env.BASE_URL + `calendar/kid/${select}`, {
            method: 'POST',
            body: JSON.stringify({
                day,
                timeRanges,
            }),
            headers: {
                'Content-type': 'application/json',
                Authorization: bearer,
            },
        }).then(async (r) => {
            if (r.status !== 201) {
                const res = await r.json();
                setShowError(true);
                setErrorMessage(res.error_description);
            } else {
                setOpened(false);
                notifications.showNotification({
                    title: 'Enfant enregistré',
                    message:
                        'Il va maintenant apparaitre dans votre calendrier',
                    color: 'teal',
                });
                Router.reload();
            }
        });
    };

    const deleteEvent = async (event) => {
        event.preventDefault();
        fetch(process.env.BASE_URL + `calendar/${selectEvent}`, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json',
                Authorization: bearer,
            },
        }).then(async (r) => {
            if (r.status !== 200) {
                const res = await r.json();
                setShowError(true);
                setErrorMessage(res.error_description);
            } else {
                setOpened(false);
                notifications.showNotification({
                    title: 'Jour de précense supprimé',
                    message: 'Il va maintenant disparaitre de votre calendrier',
                    color: 'teal',
                });
                Router.reload();
            }
        });
    };

    const edit = async (event) => {
        event.preventDefault();
        fetch(process.env.BASE_URL + `calendar/${selectEvent}/kid/${select}`, {
            method: 'PATCH',
            body: JSON.stringify({
                day,
                timeRanges,
            }),
            headers: {
                'Content-type': 'application/json',
                Authorization: bearer,
            },
        }).then(async (r) => {
            if (r.status !== 200) {
                const res = await r.json();
                setShowError(true);
                setErrorMessage(res.error_description);
            } else {
                setEditModal(false);
                notifications.showNotification({
                    title: 'Jour de précense modifié',
                    message:
                        'Il va maintenant apparaitre dans votre calendrier',
                    color: 'teal',
                });
                Router.reload();
            }
        });
    };

    return (
        <>
            <Modal
                opened={editModal}
                onClose={() => setEditModal(false)}
                title="Modifier ou supprimer le jour d'un enfant"
            >
                <Button fullWidth color="red" onClick={deleteEvent}>
                    Supprimer
                </Button>
                <Space h={'xl'} />
                {showError && (
                    <>
                        <Alert title="Erreur!" color="red">
                            {errorMessage}
                        </Alert>
                        <Space h="xl" />
                    </>
                )}
                <form onSubmit={edit}>
                    <DatePicker
                        placeholder="Choisir une date"
                        label="Jour de présence"
                        value={day}
                        onChange={setDay}
                        required
                    />
                    <Space h={'xl'} />
                    <TimeRangeInput
                        min="08:00"
                        max="20:00"
                        label="Horaires de présence"
                        value={timeRanges}
                        onChange={setTimeRanges}
                        clearable
                    />
                    <Space h={'xl'} />
                    <Select
                        value={select}
                        onChange={setSelect}
                        data={nurseKids}
                        label="Enfant"
                        placeholder="Choisir un enfant"
                    />
                    <Space h={'xl'} />
                    <Button
                        type="submit"
                        style={{
                            backgroundColor: '#4ad4c6',
                            float: 'right',
                        }}
                    >
                        Modifier
                    </Button>
                </form>
            </Modal>
            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                title="Enregistrer un jour pour un enfant"
            >
                {showError && (
                    <>
                        <Alert title="Erreur!" color="red">
                            {errorMessage}
                        </Alert>
                        <Space h="xl" />
                    </>
                )}

                <form onSubmit={calendar}>
                    <DatePicker
                        placeholder="Choisir une date"
                        label="Jour de présence"
                        value={day}
                        onChange={setDay}
                        required
                    />
                    <Space h={'xl'} />
                    <TimeRangeInput
                        label="Horaires de présence"
                        value={timeRanges}
                        onChange={setTimeRanges}
                        clearable
                    />
                    <Space h={'xl'} />
                    <Select
                        value={select}
                        onChange={setSelect}
                        data={nurseKids}
                        label="Enfant"
                        placeholder="Choisir un enfant"
                    />
                    <Space h={'xl'} />
                    <Button
                        type="submit"
                        style={{
                            backgroundColor: '#4ad4c6',
                            float: 'right',
                        }}
                    >
                        Enregistrer
                    </Button>
                </form>
            </Modal>
            <FullCalendar
                buttonText={{
                    today: "Aujourd'hui",
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
                    e.view.calendar.changeView('timeGridDay', e.dateStr);
                }}
                eventClick={(e) => {
                    setDay(e.event.start);
                    setTimeRanges([
                        dayjs(e.event.startStr).subtract(1, 'hours').toDate(),
                        dayjs(e.event.endStr).subtract(1, 'hours').toDate(),
                    ]);
                    setSelect(e.event.id);
                    setSelectEvent(e.event.groupId);
                    setEditModal(true);
                }}
                timeZone="UTC"
                locale="fr"
            />
        </>
    );
}

export default Index;

export async function getServerSideProps(ctx) {
    const sessionCallBack = await getSession(ctx);

    const authToken = new AuthToken(sessionCallBack.user.access_token);

    const res1 = await fetch(
        process.env.BASE_URL + `calendar/nurse/${authToken.decodedToken.id}`,
        {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                Authorization: authToken.authorizationString,
            },
        }
    );
    const dayKidsCalendar = await res1.json();

    const res2 = await fetch(
        process.env.BASE_URL + `kid/nurse/${authToken.decodedToken.id}/all`,
        {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                Authorization: authToken.authorizationString,
            },
        }
    );
    const kids = await res2.json();

    return {
        props: {
            userId: sessionCallBack.user.id,
            bearer: authToken.authorizationString,
            dayKidsCalendar,
            kids,
        },
    };
}