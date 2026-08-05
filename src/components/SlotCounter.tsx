import React, { useState, useEffect } from 'react';

interface SlotCounterProps {
  target: number;
  startFrom?: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  delay?: number;
  className?: string;
}

export const SlotCounter: React.FC<SlotCounterProps> = ({
  target,
  startFrom = 0,
  suffix = '',
  prefix = '',
  duration = 2000,
  delay = 200,
  className = '',
}) => {
  const [currentVal, setCurrentVal] = useState<number>(startFrom);
  const [key, setKey] = useState<number>(0);

  useEffect(() => {
    setCurrentVal(startFrom);
    let startTimestamp: number | null = null;
    let animationFrameId: number;

    const timer = setTimeout(() => {
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const elapsed = timestamp - startTimestamp;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic deceleration for smooth live counting
        const easeOutProgress = 1 - Math.pow(1 - progress, 3);
        const val = Math.round(startFrom + (target - startFrom) * easeOutProgress);
        setCurrentVal(val);

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(step);
        } else {
          setCurrentVal(target);
        }
      };

      animationFrameId = requestAnimationFrame(step);
    }, delay);

    return () => {
      clearTimeout(timer);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [target, startFrom, duration, delay, key]);

  const handleMouseEnter = () => {
    // Only re-spin on desktop mouse hover (prevents sticky touch hover on smartphones)
    if (typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      setKey((prev) => prev + 1);
    }
  };

  const digits = String(currentVal).split('').map(Number);

  return (
    <span
      onMouseEnter={handleMouseEnter}
      className={`inline-flex items-center font-bold tracking-tight cursor-pointer group/slot ${className}`}
      title="Hover to re-spin live stats counter!"
    >
      {prefix && <span>{prefix}</span>}
      {digits.map((d, idx) => (
        <span
          key={idx}
          className="relative inline-block h-[1.1em] overflow-hidden align-top leading-none select-none"
        >
          <span
            className="flex flex-col transition-transform duration-300 ease-out"
            style={{
              transform: `translateY(-${d * 10}%)`,
            }}
          >
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <span key={num} className="h-[1.1em] flex items-center justify-center">
                {num}
              </span>
            ))}
          </span>
        </span>
      ))}
      {suffix && <span className="ml-0.5">{suffix}</span>}
    </span>
  );
};
