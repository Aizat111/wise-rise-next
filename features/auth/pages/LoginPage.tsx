import { AuthLayout } from "@/features/auth/components/layout/AuthLayout";
import { LoginForm } from "@/features/auth/components/login/LoginForm";

export default function LoginPage() {
    return (
        <AuthLayout>
            <LoginForm />
        </AuthLayout>
    );
}