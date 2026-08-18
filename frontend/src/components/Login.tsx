import { Input } from '@/components/ui/input';
import { Field, FieldLabel } from '@/components/ui/field';
import { Button } from '@/components/ui/button';

type LoginProps = {
    formData: {
        identifier: string;
        password: string;
    };
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
};

function Login({
    formData,
    handleChange,
    handleSubmit,
}: LoginProps) {
    return (
        <form
            onSubmit={handleSubmit}
            className="flex w-96 flex-col gap-4 rounded-2xl border border-chirp-border bg-white px-10 py-10 shadow-xl"
        >
            <div className="mb-2">
                <h1 className="text-2xl font-bold text-chirp-text">
                    Login to Pipeline
                </h1>
                <p className="mt-1 text-sm text-chirp-muted">
                    Welcome back!
                </p>
            </div>

            <Field>
                <FieldLabel htmlFor="identifier">Username/Email</FieldLabel>
                <Input
                    id="identifier"
                    type="text"
                    placeholder="abc@gmail.com"
                    name="identifier"
                    value={formData.identifier}
                    onChange={handleChange}
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


            <Button
                type="submit"
                className="rounded-full py-3 text-sm font-semibold"
            >
                Login
            </Button>
            <div className="flex items-center">
                <div className="h-px flex-1 bg-chirp-border"></div>
                <span className="mx-4 text-xs uppercase tracking-wide text-chirp-muted">
                    or
                </span>
                <div className="h-px flex-1 bg-chirp-border"></div>
            </div>

            <Button
                type="button"
                onClick={() => {
                    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
                }}
                className="flex w-full items-center justify-center gap-3 rounded-full border border-chirp-border2 bg-white px-6 py-2.5 text-sm font-semibold text-chirp-text transition hover:bg-chirp-hover"
            >
                <img src="/google_logo.webp" alt="Google" className="h-5 w-5" />
                Continue with Google
            </Button>
        </form>
    );
}

export default Login;
