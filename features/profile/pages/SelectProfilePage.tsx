import { AuthLayout } from "@/features/auth/components/layout/AuthLayout";
import { ProfileSelector } from "@/features/profile/components/ProfileSelector";

export default function SelectProfilePage() {
  return (
    <AuthLayout solid>
      <ProfileSelector />
    </AuthLayout>
  );
}
