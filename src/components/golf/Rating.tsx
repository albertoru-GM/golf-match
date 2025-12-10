import React from 'react';

interface RatingProps {
    /** Current rating value (0 - max) */
    value: number;
    /** Maximum rating, default 10 */
    max?: number;
    /** Size of each rating unit (e.g., "1.5rem") */
    size?: string;
}

/**
 * Simple golf rating display. Renders a row of circles colored with the
 * `--golf-green` CSS variable. Filled circles represent the rating value,
 * the remaining circles are outlined.
 */
export default function Rating({ value, max = 10, size = '1.5rem' }: RatingProps) {
    const filled = Math.round(value);
    const circles = [];
    for (let i = 1; i <= max; i++) {
        const isFilled = i <= filled;
        circles.push(
            <span
                key={i}
                className={`inline-block rounded-full border border-[var(--golf-green)] ${isFilled ? 'bg-[var(--golf-green)]' : 'bg-transparent'} mx-0.5`}
                style={{ width: size, height: size }}
                aria-label={`Rating ${i}`}
            />
        );
    }
    return <div className="flex items-center" aria-live="polite">{circles}</div>;
}
