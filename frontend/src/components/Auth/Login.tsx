import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

type LoginProps = {
    formData: {
        identifier: string;
        password: string;
    };
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
};

function Login({ formData, handleChange, handleSubmit }: LoginProps) {
    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md">
            <div className="mb-8">
                <h2 className="font-heading text-2xl font-semibold">
                    Login
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">
                    Welcome back!
                </p>
            </div>

            <div className="grid gap-4">
                <Field>
                    <FieldLabel htmlFor="identifier">
                        Username or Email
                    </FieldLabel>

                    <Input
                        id="identifier"
                        type="text"
                        placeholder="username or email"
                        name="identifier"
                        value={formData.identifier}
                        onChange={handleChange}
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
                        autoComplete="current-password"
                        required
                    />
                </Field>

                <Button type="submit" className="w-full">
                    Login
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

export default Login;
