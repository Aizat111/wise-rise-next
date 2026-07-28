import Image from "@/shared/ui/Images/Image";

type AuthLayoutProps = {
    children: React.ReactNode;
    /** Solid black background (no hero image) — used on payment step */
    solid?: boolean;
};

export const AuthLayout = ({ children, solid = false }: AuthLayoutProps) => {
    if (solid) {
        return (
            <div className="relative min-h-screen overflow-hidden bg-black">
                {children}
            </div>
        );
    }

    return (
        <div className="relative min-h-screen overflow-hidden">
            <Image
                src="/background/r3.jpg"
                className="h-full w-full object-cover"
                fill
                priority
                alt="Authentication Background"
            />
            <div
                className="
    absolute inset-0
    bg-black
    md:bg-transparent
    md:bg-gradient-to-r
    md:from-black
    md:via-black/80
    md:via-50%
    md:to-transparent
  "
            />
            {children}
        </div>
    );
};