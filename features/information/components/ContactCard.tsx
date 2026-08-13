"use client";
import { cn } from "@/lib/utils";
import type { ContactCardProps } from "../types";
import { Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";


export function ContactCard({
    title,
    description,
    emailLabel,
    email,
    addressLabel,
    address,
    className,
    buttonLabel,
}: ContactCardProps) {
    const contactUs = () => {
        window.open('https://0u0c51hhbc2.typeform.com/to/NATfnS4l', '_blank');
    };

    return (
        <div className={cn(
            "text-center",
            className,)}>
            <div className="max-w-md mx-auto text-white text-left">
                <div className="text-xl font-bold  border-l-3 border-primary pl-2 uppercase  ">{title}</div>
                <p className="text-sm text-foreground/90  mt-2 font-medium">{description}</p>

                <address className=" mt-4 not-italic space-y-6 text-base leading-relaxed text-foreground/90 sm:text-base">
                    <div className="flex items-center gap-4">
                        <Mail className="w-6 h-6 text-white" />
                        <div>
                            <p className="mb-1 text-sm font-medium uppercase tracking-wide text-primary">
                                {emailLabel}
                            </p>
                            <a
                                href={`mailto:${email}`}
                                className="font-semibold text-white!   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            >
                                {email}
                            </a>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <MapPin className="w-6 h-6 text-white" />
                        <div>
                            <p className="mb-1 text-sm font-medium uppercase tracking-wide text-primary">
                                {addressLabel}
                            </p>
                            <p className="font-semibold text-foreground">{address}</p>
                        </div>
                    </div >
                </address>
                <div className="flex justify-center">
                    <Button
                        className="w-auto mt-4 px-20 py-5 bg-primary text-base rounden-sm"
                        onClick={contactUs}
                    >
                        {buttonLabel}
                    </Button>
                </div>
            </div>

        </div>
    )
}   
