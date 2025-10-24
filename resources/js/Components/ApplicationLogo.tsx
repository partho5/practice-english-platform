import { ImgHTMLAttributes } from 'react';
import { APP_LOGO_URL, APP_LOGO_ALT } from '@/config/brand';

type Props = ImgHTMLAttributes<HTMLImageElement> & { heightClassName?: string };

export default function ApplicationLogo({ heightClassName = 'h-8', ...props }: Props) {
    return (
        <img
            src={APP_LOGO_URL}
            alt={APP_LOGO_ALT}
            loading="lazy"
            className={`${heightClassName} w-auto`}
            {...props}
        />
    );
}
