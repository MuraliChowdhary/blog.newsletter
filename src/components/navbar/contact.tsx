'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Mail,
    MessageSquare,
    Phone,
    MapPin,
    Clock,
    Send,
    CheckCircle,
    Sparkles,
    Users,
    TrendingUp,
    Globe,
    ArrowRight
} from 'lucide-react';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        newsletter: '',
        subscribers: '',
        niche: '',
        message: '',
        partnership: false,
        newsletter_audit: false,
        growth_consultation: false
    });

    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically submit the form data to your backend
        console.log('Form submitted:', formData);
        setIsSubmitted(true);
    };

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const contactMethods = [
        {
            icon: Mail,
            title: 'Email Us',
            description: 'Get in touch for partnerships and general inquiries',
            contact: 'hello@creatorblog.com',
            action: 'Send Email'
        },
        {
            icon: MessageSquare,
            title: 'Live Chat',
            description: 'Chat with our team during business hours',
            contact: 'Available 9 AM - 6 PM EST',
            action: 'Start Chat'
        },
        {
            icon: Phone,
            title: 'Schedule Call',
            description: 'Book a consultation call with our partnership team',
            contact: '+1 (555) 123-4567',
            action: 'Book Call'
        }
    ];

    const faqs = [
        {
            question: 'How does the cross-promotion work?',
            answer: 'We match newsletter creators with complementary audiences. Partners mention each other\'s newsletters in their issues, sharing subscriber bases organically.'
        },
        {
            question: 'What are the requirements to join?',
            answer: 'We look for newsletters with at least 500 engaged subscribers, consistent publishing schedule, and high-quality content that aligns with our community standards.'
        },
        {
            question: 'Is there a cost to join the network?',
            answer: 'Basic partnership matching is free. We offer premium services like detailed analytics and priority matching for a small monthly fee.'
        },
        {
            question: 'How do you ensure quality partnerships?',
            answer: 'All newsletters go through a vetting process. We check engagement rates, content quality, and audience authenticity before approving partnerships.'
        }
    ];

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center px-4">
                <Card className="max-w-md w-full text-center">
                    <CardContent className="p-8">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-foreground mb-4">
                            Thank You!
                        </h2>
                        <p className="text-muted-foreground mb-6">
                            We've received your message and will get back to you within 24 hours.
                        </p>
                        <Button
                            onClick={() => setIsSubmitted(false)}
                            variant="outline"
                            className="w-full"
                        >
                            Send Another Message
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative py-24 px-4 text-center overflow-hidden">
                <div className="max-w-4xl mx-auto relative z-10">
                    <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 px-3 py-1">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Get In Touch
                    </Badge>

                    <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
                        Let's Grow Your{' '}
                        <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                            Newsletter
                        </span>
                        {' '}Together
                    </h1>

                    <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto">
                        Ready to join our community of newsletter creators? Have questions about partnerships? We're here to help you succeed.
                    </p>
                </div>

                {/* Background decoration */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>
            </section>

            {/* Contact Methods */}
            <section className="py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-8 mb-16">
                        {contactMethods.map((method, index) => {
                            const Icon = method.icon;
                            return (
                                <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:scale-105">
                                    <CardContent className="p-6 text-center">
                                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                                            <Icon className="h-8 w-8 text-primary" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-foreground mb-2">
                                            {method.title}
                                        </h3>
                                        <p className="text-muted-foreground mb-3">
                                            {method.description}
                                        </p>
                                        <p className="text-sm text-foreground font-medium mb-4">
                                            {method.contact}
                                        </p>
                                        <Button variant="outline" size="sm" className="w-full">
                                            {method.action}
                                        </Button>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Contact Form */}
            <section className="py-20 px-4 bg-muted/30">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                            Partnership Application
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            Join Our Creator Network
                        </h2>
                        <p className="text-xl text-muted-foreground">
                            Tell us about your newsletter and let's explore how we can help you grow.
                        </p>
                    </div>

                    <Card className="max-w-2xl mx-auto">
                        <CardContent className="p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Basic Info */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name *</Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                            placeholder="Your full name"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address *</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                            placeholder="your@email.com"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Newsletter Info */}
                                <div className="space-y-2">
                                    <Label htmlFor="newsletter">Newsletter Name *</Label>
                                    <Input
                                        id="newsletter"
                                        value={formData.newsletter}
                                        onChange={(e) => handleInputChange('newsletter', e.target.value)}
                                        placeholder="Your newsletter name"
                                        required
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="subscribers">Subscriber Count *</Label>
                                        <Select value={formData.subscribers} onValueChange={(value) => handleInputChange('subscribers', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select range" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="500-1k">500 - 1,000</SelectItem>
                                                <SelectItem value="1k-5k">1,000 - 5,000</SelectItem>
                                                <SelectItem value="5k-10k">5,000 - 10,000</SelectItem>
                                                <SelectItem value="10k-25k">10,000 - 25,000</SelectItem>
                                                <SelectItem value="25k+">25,000+</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="niche">Newsletter Niche *</Label>
                                        <Select value={formData.niche} onValueChange={(value) => handleInputChange('niche', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select niche" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="tech">Technology</SelectItem>
                                                <SelectItem value="business">Business</SelectItem>
                                                <SelectItem value="marketing">Marketing</SelectItem>
                                                <SelectItem value="design">Design</SelectItem>
                                                <SelectItem value="productivity">Productivity</SelectItem>
                                                <SelectItem value="finance">Finance</SelectItem>
                                                <SelectItem value="health">Health & Wellness</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Services Interest */}
                                <div className="space-y-4">
                                    <Label>Services You're Interested In</Label>
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="partnership"
                                                checked={formData.partnership}
                                                onCheckedChange={(checked) => handleInputChange('partnership', checked)}
                                            />
                                            <Label htmlFor="partnership" className="text-sm font-normal">
                                                Cross-promotion partnerships
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="newsletter_audit"
                                                checked={formData.newsletter_audit}
                                                onCheckedChange={(checked) => handleInputChange('newsletter_audit', checked)}
                                            />
                                            <Label htmlFor="newsletter_audit" className="text-sm font-normal">
                                                Newsletter audit and optimization
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="growth_consultation"
                                                checked={formData.growth_consultation}
                                                onCheckedChange={(checked) => handleInputChange('growth_consultation', checked)}
                                            />
                                            <Label htmlFor="growth_consultation" className="text-sm font-normal">
                                                Growth strategy consultation
                                            </Label>
                                        </div>
                                    </div>
                                </div>

                                {/* Message */}
                                <div className="space-y-2">
                                    <Label htmlFor="message">Tell Us About Your Newsletter</Label>
                                    <Textarea
                                        id="message"
                                        value={formData.message}
                                        onChange={(e) => handleInputChange('message', e.target.value)}
                                        placeholder="Describe your newsletter content, audience, and growth goals..."
                                        rows={4}
                                    />
                                </div>

                                <Button type="submit" size="lg" className="w-full">
                                    <Send className="w-4 h-4 mr-2" />
                                    Submit Application
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                            Frequently Asked Questions
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            Got Questions? We've Got Answers
                        </h2>
                    </div>

                    <div className="space-y-6">
                        {faqs.map((faq, index) => (
                            <Card key={index} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <h3 className="text-lg font-semibold text-foreground mb-3">
                                        {faq.question}
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 bg-muted/30">
                <div className="max-w-4xl mx-auto text-center">
                    <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-primary/20">
                        <CardContent className="p-12">
                            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Users className="w-8 h-8 text-primary" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                                Ready to Start Growing?
                            </h2>
                            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                                Join thousands of newsletter creators who are already benefiting from our partnership network. Your audience is waiting to discover amazing content.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button size="lg" className="sm:w-auto">
                                    <TrendingUp className="w-4 h-4 mr-2" />
                                    Start Your Partnership Journey
                                </Button>
                                <Button size="lg" variant="outline" className="sm:w-auto">
                                    <Globe className="w-4 h-4 mr-2" />
                                    Browse Success Stories
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <div className="space-y-2">
                            <div className="text-3xl md:text-4xl font-bold text-primary">50+</div>
                            <div className="text-muted-foreground">Active Creators</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-3xl md:text-4xl font-bold text-primary">2L+</div>
                            <div className="text-muted-foreground">Combined Subscribers</div>
                        </div>
                        {/* <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-primary">15K+</div>
              <div className="text-muted-foreground">Successful Partnerships</div>
            </div> */}
                        <div className="space-y-2">
                            <div className="text-3xl md:text-4xl font-bold text-primary">92%</div>
                            <div className="text-muted-foreground">Growth Rate</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer Contact Info */}
            <footer className="py-12 px-4 bg-muted/50 border-t">
                <div className="max-w-6xl mx-auto">
                    {/* <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center justify-center md:justify-start">
                <MapPin className="w-4 h-4 mr-2" />
                Our Location
              </h3>
              <div className="text-muted-foreground">
                <p>123 Creator Street</p>
                <p>Innovation District</p>
                <p>San Francisco, CA 94102</p>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center justify-center md:justify-start">
                <Clock className="w-4 h-4 mr-2" />
                Business Hours
              </h3>
              <div className="text-muted-foreground">
                <p>Monday - Friday: 9 AM - 6 PM</p>
                <p>Saturday: 10 AM - 4 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center justify-center md:justify-start">
                <Mail className="w-4 h-4 mr-2" />
                Get in Touch
              </h3>
              <div className="text-muted-foreground">
                <p>General: hello@creatorblog.com</p>
                <p>Partnerships: partners@creatorblog.com</p>
                <p>Support: support@creatorblog.com</p>
              </div>
            </div>
          </div> */}
                    <div className="text-center text-muted-foreground">
                        <p>&copy; 2025 Pick & Partner . All rights reserved. Built with ❤️ for newsletter creators.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}