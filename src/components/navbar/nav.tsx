'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Moon, Sun, Menu, Home, FileText, Info, Phone, User } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'; 
import Image from 'next/image';

export function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const { setTheme } = useTheme();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navigationItems = [
        { name: 'Home', href: '/', icon: Home },
        { name: 'Blog', href: '/blog', icon: FileText },
        { name: 'About', href: '/about', icon: Info },
        { name: 'Contact', href: '/contact', icon: Phone },
         { name: 'Login', href: '/signin', icon: User },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                     <Link href="/" className="flex-shrink-0">
                        <div className='flex justify-center items-center space-x-2'>
                            <div>
                                <Image
                                    src="/pnp.png"
                                    alt="PickandPartner logo"
                                    width={70}
                                    height={60}
                                    className="rounded"
                                />
                            </div>
                            <div>
                                <h1 className=" leading-none text-lg font-bold ">
                                    Pick & Partner
                                </h1>
                            </div>
                        </div>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {navigationItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`text-foreground hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname === item.href ? 'text-blue-500 font-semibold' : ''
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Search, Theme Toggle, and Mobile Menu Button */}
                    <div className="flex items-center space-x-4">
                        {/* Search (Desktop only for now, can be added to mobile sheet) */}
                        <div className="relative hidden sm:block">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <Input
                                type="text"
                                placeholder="Search posts..."
                                className="pl-10 w-64 bg-background/50 border-border/50 focus:border-blue-400"
                            />
                        </div>

                        {/* Theme Toggle */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                    <span className="sr-only">Toggle theme</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setTheme("light")}>
                                    Light
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTheme("dark")}>
                                    Dark
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTheme("system")}>
                                    System
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <Menu className="h-6 w-6" />
                                        <span className="sr-only">Open menu</span>
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-[300px] sm:w-[350px]">
                                    <SheetHeader>
                                        <SheetTitle className="text-left text-xl font-bold">
                                            Pick & Partner
                                        </SheetTitle>
                                    </SheetHeader>
                                    <nav className="mt-8">
                                        <div className="space-y-2">
                                            {navigationItems.map((item) => {
                                                const Icon = item.icon;
                                                return (
                                                    <Link
                                                        key={item.name}
                                                        href={item.href}
                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                        className="flex items-center gap-3 px-3 py-3 rounded-lg text-foreground hover:bg-muted transition-colors group"
                                                    >
                                                        <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                                                        <span className="font-medium">{item.name}</span>
                                                    </Link>
                                                );
                                            })}
                                            {/* Mobile Search within the Sheet */}
                                            <div className="px-3 py-2">
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <Search className="h-4 w-4 text-muted-foreground" />
                                                    </div>
                                                    <Input
                                                        type="text"
                                                        placeholder="Search posts..."
                                                        className="pl-10 w-full bg-background/50 border-border/50 focus:border-blue-400"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </nav>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}