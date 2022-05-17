export const scrollToBottom = (viewport) =>
    viewport.current.scrollTo({
        top: viewport.current.scrollHeight,
        behavior: 'smooth',
    });
