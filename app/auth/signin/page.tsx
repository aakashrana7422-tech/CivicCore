import { Suspense } from 'react';
import { signIn } from '@/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { GoogleSignInButton } from '@/components/auth/google-signin';
import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function SignInPage(props: {
    searchParams: Promise<{ callbackUrl?: string; error?: string; success?: string }>;
}) {
    const searchParams = await props.searchParams;

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#001d3d]">
            {/* Animated background blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-orange-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/30 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 w-full max-w-md">
                {/* Logo */}
                <div className="flex flex-col items-center mb-8">
                    <Link href="/" className="flex items-center gap-2 mb-2">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="text-blue-400">
                            <rect x="4" y="12" width="4" height="8" rx="1" fill="#fff" />
                            <rect x="10" y="8" width="4" height="12" rx="1" fill="#fb923c" />
                            <rect x="16" y="4" width="4" height="16" rx="1" fill="#fff" />
                        </svg>
                        <span className="text-2xl font-bold text-white">CivicCore</span>
                    </Link>
                    <p className="text-blue-300 text-sm">Report Civic Issues. Make a Difference.</p>
                </div>

                {/* Card */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">
                    <h1 className="text-2xl font-bold text-center text-white mb-1">Welcome Back</h1>
                    <p className="text-center text-blue-300 text-sm mb-6">Sign in to your CivicCore account</p>

                    {searchParams.success && (
                        <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-xl text-green-400 text-sm text-center">
                            ✓ Account created! Please sign in.
                        </div>
                    )}
                    {searchParams.error && (
                        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 text-sm text-center">
                            {searchParams.error === 'CredentialsSignin' ? 'Invalid email or password' : 'Authentication failed'}
                        </div>
                    )}

                    <form
                        action={async (formData) => {
                            'use server';
                            const urlParams = await props.searchParams;
                            let callbackUrl = urlParams.callbackUrl || '/dashboard';

                            if (callbackUrl.startsWith('http')) {
                                try {
                                    const url = new URL(callbackUrl);
                                    callbackUrl = url.pathname + url.search;
                                } catch {
                                    callbackUrl = '/dashboard';
                                }
                            }

                            try {
                                await signIn('credentials', formData, callbackUrl);
                            } catch (error) {
                                if (error instanceof AuthError) {
                                    switch (error.type) {
                                        case 'CredentialsSignin':
                                            redirect(`/auth/signin?error=CredentialsSignin&callbackUrl=${encodeURIComponent(callbackUrl)}`);
                                        default:
                                            redirect(`/auth/signin?error=Default&callbackUrl=${encodeURIComponent(callbackUrl)}`);
                                    }
                                }
                                throw error;
                            }
                        }}
                        className="space-y-4"
                    >
                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-blue-200 text-sm font-medium">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                required
                                placeholder="you@example.com"
                                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-blue-400 focus:ring-blue-400/20 rounded-xl h-11"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="password" className="text-blue-200 text-sm font-medium">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                placeholder="••••••••"
                                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-blue-400 focus:ring-blue-400/20 rounded-xl h-11"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full h-11 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] mt-2"
                        >
                            Sign In
                        </Button>
                    </form>

                    <div className="relative my-5">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-transparent px-3 text-blue-400/70 font-medium">or continue with</span>
                        </div>
                    </div>

                    <Suspense fallback={<div className="h-11 w-full bg-white/5 animate-pulse rounded-xl" />}>
                        <GoogleSignInButton />
                    </Suspense>

                    <p className="text-center text-sm text-blue-300/70 mt-6">
                        Don&apos;t have an account?{' '}
                        <Link href="/auth/signup" className="text-orange-400 hover:text-orange-300 font-semibold transition-colors">
                            Sign up free
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
