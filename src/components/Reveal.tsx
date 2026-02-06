import React from 'react';
import { useInView } from '../hooks/useInView';

const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className }) => {
    const { ref, inView } = useInView();
    return (
        <div
            ref={ref}
            style={{ "transitionDelay": `${Math.min(delay, 700)}ms` }}
            className={[
                'transform transition-all duration-700',
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
                className || ''
            ].join(' ').trim()}
        >
            {children}
        </div>
    );
};

export default Reveal;
