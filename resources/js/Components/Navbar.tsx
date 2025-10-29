import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import ApplicationLogo from '@/Components/ApplicationLogo';

interface NavbarProps {
    auth: PageProps['auth'];
}

export default function Navbar({ auth }: NavbarProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navigationItems = [
        { name: 'My Speaker Profile', href: '/speaking/profile' },
        { name: 'About', href: '/about' },
        { name: 'Speaking Requests', href: '/speaking/requests' },
        { name: 'Vocabulary Preparation', href: 'https://vocabulary.jovoc.com/p/speaking' },
    ];

    const appName = import.meta.env.VITE_APP_NAME;

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="flex items-center">
                            <ApplicationLogo heightClassName="h-8" />
                            <span className="ml-2 text-xl font-bold text-gray-900">{appName}</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex lg:items-center lg:space-x-8">
                        {navigationItems.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                            >
                                {item.name}
                            </a>
                        ))}
                    </div>

                    {/* Auth Links */}
                    <div className="hidden lg:flex lg:items-center lg:space-x-4">
                        {auth.user ? (
                            <>
                                <Link
                                    href={route('dashboard')}
                                    className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href={route('profile.edit')}
                                    className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                                >
                                    User Profile
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    Sign up
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="lg:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-700 hover:text-blue-600 p-2"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                {isMenuOpen && (
                    <div className="lg:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200">
                            {navigationItems.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium transition-colors"
                                >
                                    {item.name}
                                </a>
                            ))}
                            <div className="border-t border-gray-200 pt-4 mt-4">
                                {auth.user ? (
                                    <>
                                        <Link
                                            href={route('dashboard')}
                                            className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium transition-colors"
                                        >
                                            Dashboard
                                        </Link>
                                        <Link
                                            href={route('profile.edit')}
                                            className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium transition-colors"
                                        >
                                            User Profile
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium transition-colors"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="bg-blue-600 hover:bg-blue-700 text-white block px-3 py-2 rounded-md text-base font-medium transition-colors mt-2"
                                        >
                                            Sign up
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
