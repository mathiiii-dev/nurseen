import {getSession} from "next-auth/react"
import {Alert, Box, Button, Card, Center, Group, Modal, Space, Table, Text} from "@mantine/core";
import {useCallback, useEffect, useState} from "react";
import {AuthToken} from "../../../services/auth_token";
import Link from 'next/link';
import {useRouter} from "next/router";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import useEmblaCarousel from 'embla-carousel-react'
import '../../../styles/globals.css'
import DashboardCard from "../../../components/DashboardCard";

export default function Page({userId, bearer, kids, code}) {

    const router = useRouter();

    console.log(code)

    const [archiveOpened, setArchiveOpened] = useState(false);
    const [kidId, setKidId] = useState(false);
    const [viewportRef, embla] = useEmblaCarousel({
        slidesToScroll: 2,
        skipSnaps: false
    });
    const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
    const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

    const scrollPrev = useCallback(() => embla && embla.scrollPrev(), [embla]);
    const scrollNext = useCallback(() => embla && embla.scrollNext(), [embla]);
    const onSelect = useCallback(() => {
        if (!embla) return;
        setPrevBtnEnabled(embla.canScrollPrev());
        setNextBtnEnabled(embla.canScrollNext());
    }, [embla]);

    useEffect(() => {
        if (!embla) return;
        embla.on("select", onSelect);
        onSelect();
    }, [embla, onSelect]);

    let rows = null;
    dayjs.locale('fr')
    dayjs.extend(utc)
    dayjs.utc().format()

    const activate = (kidId) => {
        fetch(process.env.BASE_URL + `kid/${kidId}/activate`,
            {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': bearer
                }
            }).then(r => {
            router.reload()
        })
    }

    const archived = () => {
        fetch(process.env.BASE_URL + `kid/${kidId}/archive`,
            {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': bearer
                }
            }).then(r => {
            router.reload()
        })
    }

    if (kids) {
        rows = kids.map((element) => (
            <tr key={element.id}>
                <td>{element.firstname}</td>
                <td>{element.lastname}</td>
                <td>{dayjs(element.birthday).utc().format('DD MMMM YYYY')}</td>
                <td>
                    {
                        element.activated ?
                            <Button color="red" onClick={() => activate(element.id, false)}>Désactiver</Button>
                            :
                            <Button style={{backgroundColor: '#4ad4c6'}}
                                    onClick={() => activate(element.id, true)}>Activer</Button>
                    }
                </td>
                <td>
                    {
                        <Button color="red" onClick={() => {
                            setArchiveOpened(true)
                            setKidId(element.id)
                        }
                        }>
                            Archiver
                        </Button>
                    }
                </td>
                <td>
                    <Link href={{
                        pathname: `/dashboard/nurse/kid/[pid]/notes`,
                        query: {pid: element.id}
                    }}>
                        <Button>Note</Button>
                    </Link>
                </td>
            </tr>
        ));
    }

    return (
        <>
            <div className="embla" ref={embla}>
                <div className="embla__viewport" ref={viewportRef}>
                    <div className="embla__container">
                        <div className="embla__slide">
                            <DashboardCard
                                title={"Liaison Enfant / Nourrice"}
                                buttonText={"Code de liaison"}
                                text={"Créer un code de liaison pour que un parent enregistre un enfant"}
                                linkHref={"nurse/calendar"}
                                userId={userId}
                                bearer={bearer}
                                code={code}
                                modal
                            />
                        </div>
                        <div className="embla__slide">
                            <DashboardCard
                                title={"Calendrier"}
                                buttonText={"Ouvrir le calendrier"}
                                text={"Gérez votre emploie du temps grace au calendrier et les jours de présence des enfants"}
                                linkHref={"nurse/calendar"}
                            />
                        </div>
                        <div className="embla__slide">
                            <DashboardCard
                                title={"Note journalière"}
                                buttonText={"Ajouter une note"}
                                text={"Ajouter une note sur la journée de l'enfant. Elle sera ensuite visible par ses parents"}
                                linkHref={"nurse/note"}
                            />
                        </div>
                        <div className="embla__slide">
                            <DashboardCard
                                title={"Gallerie photo"}
                                buttonText={"Ajouter des photos"}
                                text={"Ajouter des photos des enfants en vrac. Elles serront visibles par les parents"}
                                linkHref={"nurse/gallery"}
                            />
                        </div>
                        <div className="embla__slide">
                            <DashboardCard
                                title={"Menu du jour"}
                                buttonText={"Voir / Ajouter un menu"}
                                text={"Ajouter un menu du jour. Il sera visible par les parents"}
                                linkHref={"nurse/menu"}
                            />
                        </div>
                        <div className="embla__slide">
                            <DashboardCard
                                title={"Chat en direct"}
                                buttonText={"Chat"}
                                text={"Engagez des discutions avec les parents, Répondez a leurs messages"}
                                linkHref={"nurse/chat"}
                            />
                        </div>
                        <div className="embla__slide">
                            <DashboardCard
                                title={"Gestionnaire de fichier"}
                                buttonText={"Mes Fichiers"}
                                text={"Envoyez des fichiers au parents. Voir les fichiers envoyez par les parents"}
                                linkHref={"nurse/file"}
                            />
                        </div>
                    </div>
                </div>
                <Space h={"xl"}/>
                <Center>
                    <Button
                        className="embla__button"
                        onClick={scrollPrev}
                        enabled={prevBtnEnabled}>&lt;</Button>
                    <Button
                        className="embla__button"
                        onClick={scrollNext}
                        enabled={nextBtnEnabled}>&gt;</Button>
                </Center>
            </div>
            <Modal
                opened={archiveOpened}
                onClose={() => setArchiveOpened(false)}
                hideCloseButton
                centered
            >
                <Alert title="Attention !" color="red">
                    Êtes-vous sûr de vouloir archiver cette enfant ? <br/>
                    Il n'apparaitra plus dans cette liste
                </Alert>
                <Space h={"xl"}/>
                <Button
                    fullWidth
                    color="red"
                    onClick={() => archived()}
                >Archiver</Button>
            </Modal>
            <Space h={"xl"}/>
            <Table
                horizontalSpacing="xl"
                verticalSpacing="xl"
                style={{marginTop: 10}}
            >
                <thead>
                <tr>
                    <th>Prénom</th>
                    <th>Nom</th>
                    <th>Date d'anniversaire</th>
                    <th>Enfant actif</th>
                    <th>Archiver</th>
                    <th>Note du jour</th>
                </tr>
                </thead>
                <tbody>{rows}</tbody>
            </Table>
        </>
    )
}

export async function getServerSideProps(ctx) {
    const sessionCallBack = await getSession(ctx);

    const authToken = new AuthToken(sessionCallBack.user.access_token);

    const res = await fetch(process.env.BASE_URL + `kid/nurse/${authToken.decodedToken.id}`,
        {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': authToken.authorizationString
            }
        });
    const kids = await res.json();

    const res1 = await fetch(process.env.BASE_URL + `link_code/${authToken.decodedToken.id}`,
        {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': authToken.authorizationString
            }
        });
    const code = await res1.json();

    return {
        props: {
            userId: sessionCallBack.user.id,
            bearer: authToken.authorizationString,
            kids,
            code: code.code
        }
    }
}
