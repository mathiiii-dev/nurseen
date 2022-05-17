import { CalendarIcon } from 'react-calendar-icon';
import { AiFillFile, AiFillWechat } from 'react-icons/ai';

export const cards = {
    feed: {
        title: "Fil d'actualité",
        buttonText: 'Ajouter un post',
        text: 'Montrer aux parents ce que font leurs enfants pendant la journée',
        linkHref: 'nurse/feed',
    },
    note: {
        title: 'Note journalière',
        buttonText: 'Ajouter une note',
        text: "Ajouter une note sur la journée de l'enfant. Elle sera ensuite visible par ses parents",
        linkHref: 'nurse/note',
    },
    gallery: {
        title: 'Galerie photo',
        buttonText: 'Ajouter des photos',
        text: 'Ajouter des photos des enfants en vrac. Elles serront visibles par les parents',
        linkHref: 'nurse/gallery',
    },
    menu: {
        title: 'Menu du jour',
        buttonText: 'Ajouter un menu',
        text: 'Ajouter un menu du jour. Il sera visible par les parents',
        linkHref: 'nurse/menu',
    },
};

export const verticalCards = {
    calendar: {
        children: <CalendarIcon date={new Date()} />,
        button: 'Calendrier',
        text: 'Enregitrer les heures de précense des enfants',
        linkHref: 'nurse/calendar',
    },
    file: {
        children: <AiFillFile size={64} />,
        button: 'Gestionnaire de fichier',
        text: 'Gérez et envoyer des fichiers aux parents',
        linkHref: 'nurse/file',
    },
    chat: {
        children: <AiFillWechat size={64} />,
        button: 'Chat',
        text: 'Echanger des messages avec les parents',
        linkHref: 'nurse/chat',
    },
};

export const familyCards = {
    feed: {
        title: "Fil d'actualité",
        buttonText: "Voir le fil d'actualité",
        text: 'Voir ce que font vos enfants durant la journée',
        linkHref: 'family/feed',
    },
    file: {
        title: 'Gestionnaire de fichier',
        buttonText: 'Vos fichiers',
        text: 'Envoyez des fichiers à votre nourrice et recevez des fichiers',
        linkHref: 'family/feed',
    },
    gallery: {
        title: 'Galerie photo',
        buttonText: 'Voir les photos',
        text: 'Voir les photos des enfants en vrac dans une galerie',
        linkHref: 'family/gallery',
    },
    menu: {
        title: 'Menu du jour',
        buttonText: 'Voir le menu',
        text: 'Voir le menu du jour ainsi que les anciens menus',
        linkHref: 'family/menu',
    },
};
