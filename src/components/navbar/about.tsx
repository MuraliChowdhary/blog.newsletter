"use client";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    ArrowRight,
    Mail,
    Users,
    Target,
    TrendingUp,
    Globe,
    Sparkles,
    CheckCircle,
    Heart,
    Award,
    BookOpen,
    Lightbulb,
    Shield,
    Zap
} from 'lucide-react';

export default function AboutPage() {
    const values = [
        {
            icon: Heart,
            title: 'Creator-First',
            description: 'We put newsletter creators at the center of everything we do, ensuring fair partnerships and mutual growth.',
        },
        {
            icon: Shield,
            title: 'Quality Over Quantity',
            description: 'We carefully vet all partners to ensure high-quality content and engaged audiences.',
        },
        {
            icon: Globe,
            title: 'Community Driven',
            description: 'Our platform thrives on the success of our community, fostering collaboration over competition.',
        },
        {
            icon: Zap,
            title: 'Innovation',
            description: 'We continuously improve our matching algorithms and tools to deliver better results.',
        },
    ];

    const milestones = [
        {
            year: '2022',
            title: 'Foundation',
            description: 'Pick & Partner was founded with the vision of connecting newsletter creators worldwide.',
        },
        {
            year: '2023',
            title: 'First 100 Partners',
            description: 'Reached our first milestone of 100 newsletter partners across various niches.',
        },
        {
            year: '2024',
            title: 'Global Expansion',
            description: 'Expanded to serve creators in over 50 countries with localized support.',
        },
        {
            year: '2025',
            title: 'AI-Powered Matching',
            description: 'Launched our advanced AI matching system for better partnership recommendations.',
        },
    ];

    const team = [
        {
            name: 'Sarah Johnson',
            role: 'Founder & CEO',
            description: 'Former newsletter creator with 5 years of experience in audience building and cross-promotion strategies.',
        },
        {
            name: 'Michael Chen',
            role: 'Head of Partnerships',
            description: 'Expert in creator economy with a track record of building successful collaboration networks.',
        },
        {
            name: 'Emily Rodriguez',
            role: 'Product Manager',
            description: 'Passionate about creating tools that empower creators to grow their audiences authentically.',
        },
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative py-24 px-4 text-center overflow-hidden">
                <div className="max-w-4xl mx-auto relative z-10">
                    <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 px-3 py-1">
                        <Sparkles className="w-3 h-3 mr-1" />
                        About CreatorBlog
                    </Badge>

                    <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
                        Empowering Newsletter{' '}
                        <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                            Creators
                        </span>
                        {' '}Worldwide
                    </h1>

                    <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto">
                        We believe in the power of authentic connections. Our mission is to help newsletter creators grow their audiences through strategic partnerships and meaningful cross-promotions.
                    </p>
                </div>

                {/* Background decoration */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                                Our Mission
                            </Badge>
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                                Building Bridges Between Newsletter Creators
                            </h2>
                            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                                In today's crowded digital landscape, growing a newsletter audience organically can be challenging. We recognized that many talented creators have amazing content but struggle to reach their ideal audience.
                            </p>
                            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                                That's why we created Pick & Partner - a platform that connects newsletter creators with complementary audiences, enabling them to grow together through strategic cross-promotions and authentic partnerships.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button asChild size="lg">
                                    <Link href="/contact">
                                        Join Our Network
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" size="lg">
                                    <Link href="/blog">
                                        Read Success Stories
                                    </Link>
                                </Button>
                            </div>
                        </div>
                        <div className="relative">
                            <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                                <CardContent className="p-0">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-primary mb-2">100+</div>
                                            <div className="text-muted-foreground">Active Partners</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-primary mb-2">3L+</div>
                                            <div className="text-muted-foreground">Subscribers Reached</div>
                                        </div>
                                        {/* <div className="text-center">
                      <div className="text-3xl font-bold text-primary mb-2">+</div>
                      <div className="text-muted-foreground">Countries</div>
                    </div> */}
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-primary mb-2">95%</div>
                                            <div className="text-muted-foreground">Success Rate</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 px-4 bg-muted/30">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                            Our Values
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            What Drives Us Forward
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Our core values shape every decision we make and every feature we build.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => {
                            const Icon = value.icon;
                            return (
                                <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-border/50">
                                    <CardContent className="p-6 text-center">
                                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                                            <Icon className="h-8 w-8 text-primary" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-foreground mb-3">
                                            {value.title}
                                        </h3>
                                        <p className="text-muted-foreground leading-relaxed">
                                            {value.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Timeline Section */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                            Our Journey
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            Milestones & Growth
                        </h2>
                        <p className="text-xl text-muted-foreground">
                            From a simple idea to a thriving community of newsletter creators.
                        </p>
                    </div>

                    <div className="space-y-8">
                        {milestones.map((milestone, index) => (
                            <div key={index} className="flex items-start gap-6">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                                        {milestone.year.slice(-2)}
                                    </div>
                                </div>
                                <Card className="flex-1 hover:shadow-md transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="text-xl font-semibold text-foreground">
                                                {milestone.title}
                                            </h3>
                                            <Badge variant="outline" className="text-xs">
                                                {milestone.year}
                                            </Badge>
                                        </div>
                                        <p className="text-muted-foreground">
                                            {milestone.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-20 px-4 bg-muted/30">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                            Meet the Team
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            The People Behind CreatorBlog
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Our dedicated team is passionate about helping newsletter creators succeed.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {team.map((member, index) => (
                            <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                                <CardContent className="p-8 text-center">
                                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                                        <Users className="h-10 w-10 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-foreground mb-2">
                                        {member.name}
                                    </h3>
                                    <Badge variant="secondary" className="mb-4">
                                        {member.role}
                                    </Badge>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {member.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-primary/20 backdrop-blur-sm">
                        <CardContent className="p-12">
                            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Mail className="w-8 h-8 text-primary" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                                Ready to Join Our Community?
                            </h2>
                            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                                Be part of a growing network of newsletter creators who are building authentic audiences together.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button asChild size="lg" className="text-lg px-8 py-3">
                                    <Link href="/contact">
                                        Get Started Today
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" size="lg" className="text-lg px-8 py-3">
                                    <Link href="/blog">
                                        Read Our Blog
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    );
}