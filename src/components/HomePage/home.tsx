'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import {
    ArrowRight,
    BookOpen,
    Users,
    TrendingUp,
    Zap,
    Mail,
    Globe,
    Target,
    Sparkles,
    ArrowUpRight,
    CheckCircle,
    Star,
    Menu,
    Home,
    Info,
    Phone,
    FileText,
    X
} from 'lucide-react';

export default function HomePage() {
    const [isOpen, setIsOpen] = useState(false);

    const features = [
        {
            icon: Mail,
            title: 'Newsletter Network',
            description: 'Connect with a curated network of newsletter creators and expand your reach through strategic cross-promotions.',
        },
        {
            icon: Target,
            title: 'Targeted Audience',
            description: 'Reach engaged subscribers who are genuinely interested in quality content and newsletter recommendations.',
        },
        {
            icon: Globe,
            title: 'Global Reach',
            description: 'Expand your newsletter\'s reach across different niches and geographic locations with our partner network.',
        },
        {
            icon: TrendingUp,
            title: 'Growth Analytics',
            description: 'Track your cross-promotion performance with detailed analytics and optimize your collaboration strategy.',
        },
    ];

    const stats = [
        { number: '100+', label: 'Newsletter Partners' },
        { number: '3L+', label: 'Subscribers Reached' },
        { number: '95%', label: 'Satisfaction Rate' },
    ];

    const testimonials = [
        {
            name: 'Sarah Chen',
            role: 'Tech Newsletter Creator',
            content: 'Pick & Partner helped me grow my newsletter from 1K to 10K subscribers in just 3 months through strategic cross-promotions.',
            rating: 5,
        },
        {
            name: 'Michael Rodriguez',
            role: 'Marketing Newsletter',
            content: 'The quality of partnerships and the professional approach made all the difference in our growth strategy.',
            rating: 5,
        },
    ];



    return (
        <div className="min-h-screen bg-background">
            {/* Mobile Header with Sidebar */}


            {/* Add top padding to account for fixed header */}
            <div>
                {/* Hero Section */}
                <section className="relative py-24 px-4 text-center overflow-hidden">
                    <div className="max-w-4xl mx-auto relative z-10">
                        {/* Badge */}
                        <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 px-3 py-1">
                            <Sparkles className="w-3 h-3 mr-1" />
                            Newsletter Cross-Promotion Platform
                        </Badge>

                        <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6">
                            Grow Your{' '}
                            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                                Newsletter
                            </span>
                            <br />
                            Through Strategic Partnerships
                        </h1>

                        <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto">
                            Connect with fellow newsletter creators, share audiences, and grow your subscriber base through proven cross-promotion strategies.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button asChild size="lg" className="text-lg px-8 py-3 shadow-lg">
                                <Link href="/blog">
                                    Explore Success Stories
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-3 border-2">
                                <Link href="/about">
                                    Learn How It Works
                                    <ArrowUpRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Background decoration */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/5 to-transparent rounded-full blur-3xl"></div>
                    </div>

                    {/* Floating elements */}
                    <div className="absolute top-20 left-10 hidden lg:block">
                        <div className="bg-card border border-border/50 rounded-lg p-3 shadow-lg backdrop-blur-sm">
                            <Mail className="w-6 h-6 text-primary" />
                        </div>
                    </div>
                    <div className="absolute bottom-20 right-10 hidden lg:block">
                        <div className="bg-card border border-border/50 rounded-lg p-3 shadow-lg backdrop-blur-sm">
                            <Users className="w-6 h-6 text-primary" />
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-16 px-4 bg-muted/30">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center">
                                    <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                                        {stat.number}
                                    </div>
                                    <div className="text-muted-foreground">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                                How It Works
                            </Badge>
                            <h2 className="text-4xl font-bold text-foreground mb-4">
                                Everything You Need to Grow Your Newsletter
                            </h2>
                            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                                Our platform connects newsletter creators with complementary audiences, creating win-win partnerships that drive real growth.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {features.map((feature, index) => {
                                const Icon = feature.icon;
                                return (
                                    <Card
                                        key={index}
                                        className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border-border/50 hover:border-primary/20"
                                    >
                                        <CardHeader className="text-center pb-4">
                                            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors group-hover:scale-110">
                                                <Icon className="h-8 w-8 text-primary" />
                                            </div>
                                            <CardTitle className="text-xl font-semibold text-foreground">
                                                {feature.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="text-center">
                                            <p className="text-muted-foreground leading-relaxed">
                                                {feature.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="py-20 px-4 bg-muted/30">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                                Success Stories
                            </Badge>
                            <h2 className="text-4xl font-bold text-foreground mb-4">
                                Loved by Newsletter Creators
                            </h2>
                            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                                See how our cross-promotion platform has helped creators grow their audiences and build meaningful partnerships.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {testimonials.map((testimonial, index) => (
                                <Card key={index} className="border-border/50 bg-card/50 backdrop-blur-sm">
                                    <CardContent className="p-8">
                                        <div className="flex items-center mb-4">
                                            {[...Array(testimonial.rating)].map((_, i) => (
                                                <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                                            ))}
                                        </div>
                                        <p className="text-foreground/80 mb-6 leading-relaxed text-lg">
                                            "{testimonial.content}"
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                                <Users className="w-6 h-6 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-foreground">{testimonial.name}</p>
                                                <p className="text-muted-foreground text-sm">{testimonial.role}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Process Section */}
                <section className="py-20 px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                                Simple Process
                            </Badge>
                            <h2 className="text-4xl font-bold text-foreground mb-4">
                                Start Growing in 3 Easy Steps
                            </h2>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    step: '01',
                                    title: 'Join Our Network',
                                    description: 'Sign up and tell us about your newsletter, audience, and goals.',
                                    icon: Users,
                                },
                                {
                                    step: '02',
                                    title: 'Find Partners',
                                    description: 'We match you with complementary newsletters in your niche.',
                                    icon: Target,
                                },
                                {
                                    step: '03',
                                    title: 'Grow Together',
                                    description: 'Execute cross-promotions and watch your subscriber base grow.',
                                    icon: TrendingUp,
                                },
                            ].map((item, index) => {
                                const Icon = item.icon;
                                return (
                                    <Card key={index} className="relative group hover:shadow-lg transition-all duration-300">
                                        <CardContent className="p-8 text-center">
                                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                                                    {item.step}
                                                </div>
                                            </div>
                                            <div className="mt-4 mb-6">
                                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                                                    <Icon className="w-8 h-8 text-primary" />
                                                </div>
                                                <h3 className="text-xl font-semibold text-foreground mb-3">
                                                    {item.title}
                                                </h3>
                                                <p className="text-muted-foreground">
                                                    {item.description}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-primary/20 backdrop-blur-sm shadow-2xl">
                            <CardContent className="p-12">
                                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Mail className="w-8 h-8 text-primary" />
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                                    Ready to Grow Your Newsletter?
                                </h2>
                                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                                    Join thousands of newsletter creators who are already growing their audiences through strategic cross-promotions.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Button asChild size="lg" className="text-lg px-8 py-3 shadow-lg">
                                        <Link href="/contact">
                                            Get Started Today
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        </Link>
                                    </Button>
                                    <Button asChild variant="outline" size="lg" className="text-lg px-8 py-3 border-2">
                                        <Link href="/blog">
                                            Read Success Stories
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>
            </div>
        </div>
    );
}