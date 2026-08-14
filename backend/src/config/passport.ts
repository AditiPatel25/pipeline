import passport from 'passport';
import { prisma } from '../prisma.js';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

function generateRandomUsername(email: string) {
    const emailPrefix = email.split('@')[0];
    const cleanPrefix = emailPrefix?.replace(/[^a-zA-Z0-9]/g, '');
    const randomNum = Math.floor(1000 + Math.random() * 9000);

    return `${cleanPrefix}${randomNum}`;
}

if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error('GOOGLE_CLIENT_ID is not defined');
}

if (!process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error('GOOGLE_CLIENT_SECRET is not defined');
}

if (!process.env.GOOGLE_CALLBACK_URL) {
    throw new Error('GOOGLE_CALLBACK_URL is not defined');
}

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL;

passport.use(
    new GoogleStrategy(
        {
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails?.[0]?.value;

                if (!email) {
                    return done(
                        new Error(
                            'Google account does not have an email address'
                        )
                    );
                }

                const existingByGoogleId = await prisma.user.findUnique({
                    where: { googleId: profile.id },
                });

                if (existingByGoogleId) {
                    return done(null, existingByGoogleId);
                }

                const existingByEmail = await prisma.user.findUnique({
                    where: { email },
                });

                if (existingByEmail) {
                    // Email already belongs to a local (password-based) account.
                    // Keep local and Google accounts separate —> don't link.
                    return done(null, false, {
                        message:
                            'An account with this email already exists. Please log in with your password instead.',
                    });
                }

                const createdUser = await prisma.user.create({
                    data: {
                        name: profile.displayName,
                        googleId: profile.id,
                        email,
                        username: generateRandomUsername(email),
                        password: null,
                    },
                });

                return done(null, createdUser);
            } catch (err) {
                return done(err);
            }
        }
    )
);

export default passport;
