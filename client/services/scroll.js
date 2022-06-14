export const scrollToBottom = (viewport) => {
    if (viewport.current) {
        viewport.current.scrollTo({
            top: viewport.current.scrollHeight,
            behavior: 'smooth',
        });
    }
};
