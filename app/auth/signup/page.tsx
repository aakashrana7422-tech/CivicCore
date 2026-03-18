'use client';

import { useTransition, useState, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { registerAction } from '@/app/actions/auth';
import { GoogleSignInButton } from '@/components/auth/google-signin';

export default function SignUpPage() {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const onSubmit = (formData: FormData) => {
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const name = formData.get('name') as string;

        setError(null);

        startTransition(async () => {
            const result = await registerAction({ email, password, name });
            if (result?.error) {
                setError(result.error);
            }
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#001d3d]">
            {/* Animated background blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-500/15 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
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
                    <p className="text-blue-300 text-sm">Join thousands making their city better</p>
                </div>

                {/* Card */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">
                    <h1 className="text-2xl font-bold text-center text-white mb-1">Create Account</h1>
                    <p className="text-center text-blue-300 text-sm mb-6">Start reporting civic issues today</p>

                    {error && (
                        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form action={onSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="name" className="text-blue-200 text-sm font-medium">Full Name</Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                required
                                placeholder="John Doe"
                                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-blue-400 focus:ring-blue-400/20 rounded-xl h-11"
                            />
                        </div>
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
                            className="w-full h-11 bg-[#f97316] hover:bg-[#ea580c] text-white font-semibold rounded-xl shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] mt-2"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                    </svg>
                                    Creating Account...
                                </span>
                            ) : 'Create Account'}
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
                        Already have an account?{' '}
                        <Link href="/auth/signin" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>

                <p className="text-center text-xs text-blue-400/40 mt-4">
                    By signing up you agree to help make your city better
                </p>
            </div>
        </div>
    );
}
