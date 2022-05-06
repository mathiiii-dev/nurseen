import {getSession} from "next-auth/react";
import {AuthToken} from "../../../services/auth_token";
import Link from 'next/link';
import {Button, Center, Space, Table} from "@mantine/core";
import DashboardCard from "../../../components/DashboardCard";
import useEmblaCarousel from 'embla-carousel-react'
import '../../../styles/globals.css'
import {useCallback, useEffect, useState} from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

function Family({userId, bearer, kids}) {

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

    if (kids) {
        rows = kids.map((element) => (
            <tr key={element.id}>
                <td>{element.firstname}</td>
                <td>{element.lastname}</td>
                <td>{dayjs(element.birthday).utc().format('DD MMMM YYYY')}</td>
                <td>
                    <Link href={{
                        pathname: `/dashboard/family/kid/[pid]/note`,
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
                                title={"Vos enfants"}
                                buttonText={"Ajouter un enfant"}
                                text={"Ajouter vos enfant pour qu'ils soient liés à leur nourrice. Code nourrice nécessaire"}
                                linkHref={"family/create-kid"}
                            />
                        </div>
                        <div className="embla__slide">
                            <DashboardCard
                                title={"Gallerie photo"}
                                buttonText={"Voir les photos"}
                                text={"Votre nourrice peut ajouter ici des photos en vrac de tout les enfants"}
                                linkHref={"family/gallery"}
                            />
                        </div>
                        <div className="embla__slide">
                            <DashboardCard
                                title={"Menu du jour"}
                                buttonText={"Voir le menu"}
                                text={"Votre nourrice peut ajouter ici le menu du jour"}
                                linkHref={"family/menu"}
                            />
                        </div>
                        <div className="embla__slide">
                            <DashboardCard
                                title={"Chat en direct"}
                                buttonText={"Chat"}
                                text={"Voir les messages envoyez par votre nourrice. Envoyez des messages"}
                                linkHref={"family/chat"}
                            />
                        </div>
                        <div className="embla__slide">
                            <DashboardCard
                                title={"Gestionnaire de fichiers"}
                                buttonText={"Mes fichiers"}
                                text={"Envoyez des fichiers à votre nourrice. Voir vos fichiers"}
                                linkHref={"family/file"}
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
                    <th>Notes</th>
                </tr>
                </thead>
                <tbody>{rows}</tbody>
            </Table>
        </>
    )
}

export default Family;

export async function getServerSideProps(ctx) {
    const sessionCallBack = await getSession(ctx);

    const authToken = new AuthToken(sessionCallBack.user.access_token);

    const res = await fetch(process.env.BASE_URL + `kid/family/${authToken.decodedToken.id}`,
        {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': authToken.authorizationString
            }
        });
    const kids = await res.json()

    const res1 = await fetch(process.env.BASE_URL + `message`,
        {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': authToken.authorizationString
            }
        });
    const messages = await res1.json()

    return {
        props: {
            userId: sessionCallBack.user.id,
            bearer: authToken.authorizationString,
            kids,
            messages
        }
    }
}
