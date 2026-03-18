import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    trustHost: true,
    pages: {
        signIn: '/auth/signin',
    },
    providers: [
        // Added later in auth.ts to avoid edge issues with some providers if needed
    ],
    callbacks: {
        async redirect({ url, baseUrl }) {
            // Always convert absolute URLs to relative paths
            // This prevents NextAuth from redirecting to internal hostname (localhost:10000)
            if (url.startsWith('/')) return url;
            try {
                const urlObj = new URL(url);
                // If the URL is on the same base, extract just the path
                return urlObj.pathname + urlObj.search;
            } catch {
                return '/dashboard';
            }
        },
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.image = user.image;
                token.name = user.name;
            }
            if (trigger === "update" && session?.user) {
                if (session.user.image) token.image = session.user.image;
                if (session.user.name) token.name = session.user.name;
            }

            // Refresh image from database on each session check to keep it persistent
            if (token.id) {
                try {
                    const { default: prisma } = await import('@/lib/prisma');
                    const dbUser = await prisma.user.findUnique({
                        where: { id: token.id as string },
                        select: { image: true },
                    });
                    if (dbUser?.image) {
                        token.image = dbUser.image;
                    }
                } catch {
                    // Silently fail — use cached token image
                }
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as "CITIZEN" | "ADMIN";
                session.user.image = token.image as string;
                session.user.name = token.name as string;
            }
            return session;
        },
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const role = auth?.user?.role;
            const isOnAdmin = nextUrl.pathname.startsWith('/admin');
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
            const isOnReport = nextUrl.pathname.startsWith('/report');
            const isOnMyReports = nextUrl.pathname.startsWith('/my-reports');
            const isOnComplaints = nextUrl.pathname.startsWith('/complaints');
            const isOnAuth = nextUrl.pathname.startsWith('/auth');
            const isOnProfile = nextUrl.pathname.startsWith('/profile');

            // Helper: redirect unauthenticated users to signup
            const redirectToSignup = () =>
                Response.redirect(new URL('/auth/signup', nextUrl));

            // 1. If user is logged in and trying to access auth pages, redirect to their dashboard
            if (isOnAuth && isLoggedIn) {
                const dashboard = role === 'ADMIN' ? '/admin' : '/dashboard';
                return Response.redirect(new URL(dashboard, nextUrl));
            }

            // 2. Admin protection
            if (isOnAdmin) {
                if (!isLoggedIn) return redirectToSignup();
                if (role === 'ADMIN') return true;
                return Response.redirect(new URL('/dashboard', nextUrl)); // Citizen tried to access admin
            }

            // 3. User Dashboard & Report protection
            if (isOnDashboard || isOnReport) {
                if (!isLoggedIn) return redirectToSignup();

                // If an Admin tries to access Citizen areas, redirect to Admin Dashboard
                if (role === 'ADMIN') {
                    return Response.redirect(new URL('/admin', nextUrl));
                }
                return true;
            }

            // 4. My Reports - require login
            if (isOnMyReports) {
                if (!isLoggedIn) return redirectToSignup();
                return true;
            }

            // 5. Profile page - require login
            if (isOnProfile) {
                if (!isLoggedIn) return redirectToSignup();
                return true;
            }

            // 6. Complaint detail pages - require login, both roles allowed
            if (isOnComplaints) {
                if (!isLoggedIn) return redirectToSignup();
                return true;
            }

            return true;
        },
    },
} satisfies NextAuthConfig;
