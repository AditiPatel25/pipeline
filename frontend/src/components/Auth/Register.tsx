import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

type RegisterProps = {
    formData: {
        email: string;
        username: string;
        password: string;
        name: string;
    };
    confirmPassword: string;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleConfirmPasswordChange: (
        e: React.ChangeEvent<HTMLInputElement>
    ) => void;
    handleSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
};

function Register({
    formData,
    confirmPassword,
    handleChange,
    handleConfirmPasswordChange,
    handleSubmit,
}: RegisterProps) {
    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md">
            <div className="mb-8">
                <h2 className="font-heading text-2xl font-semibold">
                    Create your account
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">
                    Start organizing your job search in one place.
                </p>
            </div>

            <div className="grid gap-4">
                <Field>
                    <FieldLabel htmlFor="name">Display Name</FieldLabel>
                    <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        placeholder="John Doe"
                        onChange={handleChange}
                        required
                    />
                </Field>

                <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                        id="email"
                        type="email"
                        placeholder="abc@gmail.com"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        autoComplete="email"
                        required
                    />
                </Field>

                <Field>
                    <FieldLabel htmlFor="username">Username</FieldLabel>
                    <Input
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="johndoe"
                        autoComplete="username"
                        required
                    />
                </Field>

                <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        autoComplete="new-password"
                        required
                    />
                </Field>

                <Field>
                    <FieldLabel htmlFor="confirmPassword">
                        Confirm Password
                    </FieldLabel>

                    <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        autoComplete="new-password"
                        required
                    />
                </Field>

                <Button type="submit" className="w-full">
                    Create Account
                </Button>

                <div className="flex items-center">
                    <div className="h-px flex-1 bg-border" />

                    <span className="mx-4 text-xs uppercase tracking-wide text-muted-foreground">
                        or
                    </span>

                    <div className="h-px flex-1 bg-border" />
                </div>

                <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                        window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
                    }}
                    className="w-full"
                >
                    <img src="/google_logo.webp" alt="" className="h-5 w-5" />
                    Continue with Google
                </Button>
            </div>
        </form>
    );
}

export default Register;
