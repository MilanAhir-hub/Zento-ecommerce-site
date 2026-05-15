import { useState, useEffect, useRef } from 'react';
import type { ImgHTMLAttributes } from 'react';

interface BlurImageProps extends ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    wrapperClassName?: string;
}

const BlurImage = ({ src, alt, className, wrapperClassName, ...props }: BlurImageProps) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    // Reset loading state and check for cache hits
    useEffect(() => {
        setIsLoaded(false);

        // If image is already in cache and complete, trigger loaded state immediately
        if (imgRef.current?.complete) {
            setIsLoaded(true);
        }
    }, [src]);

    return (
        <div className={`relative overflow-hidden bg-[#f5f5f7] ${wrapperClassName || ''}`}>
            {/* Blurry Apple-style Loading Overlay */}
            <div
                className={`absolute inset-0 bg-white/40 backdrop-blur-xl transition-opacity duration-700 ease-in-out z-10 flex items-center justify-center
                ${isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100 animate-pulse'}`}
            />
            <img
                ref={imgRef}
                src={src}
                alt={alt}
                onLoad={() => setIsLoaded(true)}
                className={`w-full h-full transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] will-change-[transform,filter] ${isLoaded ? 'blur-0 scale-100 opacity-100' : 'blur-2xl scale-105 opacity-0'} ${className?.includes('object-') ? '' : 'object-cover'} ${className || ''}`}
                loading="lazy"
                {...props}
            />
        </div>
    );
};

export default BlurImage;
