import { PrivacyPolicyContent } from "../content/PrivacyPolicyContent";

/** KVKK Aydınlatma Metni — aynı hukuki metin, farklı sayfa başlığı. */
export async function KvkkPage() {
  return <PrivacyPolicyContent titleKey="pages.kvkk" />;
}
