import { SITE } from "@/config/site";
import JsonLd from "../JsonLd";

export default function OrganizationSchema() {
    return (
        <JsonLd
            data={{
                "@context": "https://schema.org",
                "@type": "Organization",

                "@id": `${SITE.url}/#organization`,

                name: SITE.name,

                alternateName: SITE.shortName,

                url: SITE.url,

                logo: {
                    "@type": "ImageObject",
                    url: `${SITE.url}${SITE.logo}`,
                },

                image: `${SITE.url}${SITE.logo}`,

                description: SITE.description,

                email: SITE.email,

                telephone: SITE.phone,

                sameAs: [
                    SITE.socials.facebook,
                    SITE.socials.instagram,
                    SITE.socials.linkedin,
                    SITE.socials.youtube,
                    SITE.socials.x,
                ],

                contactPoint: {
                    "@type": "ContactPoint",
                    telephone: SITE.phone,
                    email: SITE.email,
                    contactType: "customer support",
                    availableLanguage: ["Turkish", "English"],
                },
            }}
        />
    );
}