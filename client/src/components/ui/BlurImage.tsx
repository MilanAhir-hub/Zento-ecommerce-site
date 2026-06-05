import { useState, useEffect, useRef } from "react";
import type { ImgHTMLAttributes } from "react";

interface BlurImageProps extends ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    wrapperClassName?: string;
    aspectRatio?: "1" | "3/4" | "2/3" | "4/5" | "16/9";
}

const aspectMap: Record<NonNullable<BlurImageProps["aspectRatio"]>, string> = {
    "1": "aspect-square",
    "3/4": "aspect-[3/4]",
    "2/3": "aspect-[2/3]",
    "4/5": "aspect-[4/5]",
    "16/9": "aspect-video",
};

const BlurImage = ({
    src,
    alt,
    className = "",
    wrapperClassName = "",
    aspectRatio,
    width,
    height,
    ...props
}: BlurImageProps) => {
    const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const isLoaded = loadedSrc === src;

    useEffect(() => {
        if (imgRef.current?.complete && imgRef.current.src === src) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setLoadedSrc(src);
        }
    }, [src]);

    return (
        <div
            className={[
                "relative overflow-hidden bg-[#F9F9F9]",
                aspectRatio ? aspectMap[aspectRatio] : "",
                wrapperClassName,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            <div
                aria-hidden="true"
                className={[
                    "absolute inset-0",
                    "bg-[#F9F9F9]",
                    "transition-opacity duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
                    isLoaded ? "opacity-0 pointer-events-none" : "opacity-100 animate-pulse",
                ].join(" ")}
            />
            <img
                ref={imgRef}
                src={src}
                alt={alt}
                width={width}
                height={height}
                loading="lazy"
                decoding="async"
                onLoad={() => setLoadedSrc(src)}
                className={[
                    "w-full h-full object-cover",
                    "transition-[opacity,filter,transform] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
                    isLoaded ? "opacity-100 blur-0 scale-100" : "opacity-0 blur-md scale-[1.02]",
                    className,
                ].join(" ")}
                {...props}
            />
        </div>
    );
};

export default BlurImage;
