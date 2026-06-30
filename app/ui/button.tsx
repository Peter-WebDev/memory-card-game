import clsx from "clsx";
import { ButtonHTMLAttributes } from "react";

type ButtonProps = {
    children: React.ReactNode;
    className?: string;
    variant?: 'primary' | 'secondary' | 'default' | 'active';
    type?: 'button' | 'submit' | 'reset';
    onClick?: () => void;
    'dataCy'?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
    children,
    className,
    variant = 'default',
    type = 'button',
    onClick,
    dataCy,
    ...rest
}: ButtonProps) {
    const baseClasses = "rounded-md px-4 py-2 text-sm font-bold border-b-4 border-gray-700 hover:border-gray-500 cursor-pointer transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 focus-visible:ring-lime-500 disabled:opacity-50 disabled:pointer-events-none";

    const variantClasses = {
        default: "text-white",
        primary: "bg-gray-900 text-gray-100 hover:bg-gray-800",
        secondary: "bg-white text-gray-900 hover:bg-gray-50",
        active: "bg-lime-500 text-gray-900 hover:bg-lime-400"
    };

    const disabledClasses = "disabled:cursor-not-allowed disabled:bg-gray-400 disabled:text-gray-200";

    return (
        <>
            <button
                data-cy={dataCy}
                onClick={onClick}
                type={type}
                className={clsx(
                    baseClasses,
                    variantClasses[variant],
                    disabledClasses,
                    className
                )}
                {...rest}
            >
                {children}
            </button>
        </>
    );
}