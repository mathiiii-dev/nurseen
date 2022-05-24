import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import '../../../styles/globals.css';
import { getSession } from 'next-auth/react';
import { AuthToken } from '../../../services/auth_token';

export default function Calendar({ dayKidsCalendar }) {
    let events = null;
    if (dayKidsCalendar) {
        events = dayKidsCalendar.map((element) => ({
            id: element.kid_id,
            groupId: element.id,
            title: element.firstname + ' ' + element.lastname,
            start: element.day + ' ' + element.arrival,
            end: element.day + ' ' + element.departure,
            color: element.color,
        }));
    }
    return (
        <>
            <FullCalendar
                className={'test'}
                buttonText={{
                    today: "Aujourd'hui",
                    month: 'Mois',
                    week: 'Semaine',
                    day: 'Jour',
                }}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                    center: 'dayGridMonth,timeGridWeek,timeGridDay',
                }}
                events={events}
                dateClick={(e) => {
                    e.view.calendar.changeView('timeGridDay', e.dateStr);
                }}
                timeZone="UTC"
                locale="fr"
                eventColor
            />
        </>
    );
}

export async function getServerSideProps(ctx) {
    const sessionCallBack = await getSession(ctx);

    const authToken = new AuthToken(sessionCallBack.user.access_token);

    const res = await fetch(
        `${process.env.BASE_URL}calendar/family/${authToken.decodedToken.id}`,
        {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                Authorization: authToken.authorizationString,
            },
        }
    );

    const dayKidsCalendar = await res.json();

    return {
        props: {
            userId: sessionCallBack.user.id,
            bearer: authToken.authorizationString,
            dayKidsCalendar,
        },
    };
}
