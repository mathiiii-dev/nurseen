export const scrollToBottom = (viewport) => {
    console.log(viewport);
    viewport.current.scrollTo({
        top: viewport.current.scrollHeight,
        behavior: 'smooth',
    });
};
