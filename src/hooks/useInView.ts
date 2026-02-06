import { useRef, useState, useEffect } from 'react';

export const useInView = (options?: IntersectionObserverInit) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setInView(true);
                observer.unobserve(entry.target);
            }
        }, options ?? { threshold: 0.15 });

        observer.observe(node);
        return () => observer.disconnect();
    }, [options]);

    return { ref, inView } as const;
};
