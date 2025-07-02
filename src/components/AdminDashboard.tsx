'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'; // Import useRouter
import { Users, LayoutDashboard, FileText, PlusSquare, Settings } from 'lucide-react'; // Icons for navigation
import { cn } from '@/lib/utils'; // Assuming you have a utility for class names
// Assuming useToast is available from shadcn/ui

// Import the components that will be rendered inside the dashboard
import { ManageUsers } from './ManageUsers';
import { ManageBlogPosts } from './ManageBlogs'; // Your existing component
import { CreateBlogPostForm } from './createBlogPost'; // Your existing component
import { Button } from './ui/button';
import { DashboardOverview } from './DashbordOverview';

// Function to get JWT from localStorage (provided by user)
export function getCookieValue(name: any) {
    const token = localStorage.getItem(name);
    if (token) {
        return token;
    }
    return null;
}

// Helper for JWT decoding (client-side only, does NOT verify signature for security)
// You would typically install this: `npm install jwt-decode` or `yarn add jwt-decode`
import { jwtDecode } from 'jwt-decode'; // Assuming jwt-decode is installed
import { toast } from 'sonner';

export function AdminDashboard() {
    const pathname = usePathname();
    const router = useRouter(); // Initialize useRouter
    const [activeSection, setActiveSection] = useState<string>('users'); // Default to 'users'
    const [isAuthenticatedAdmin, setIsAuthenticatedAdmin] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true); // State to manage loading before auth check

    useEffect(() => {
        const checkAdminAuth = () => {
            const jwtToken = getCookieValue('jwtToken'); // Assuming 'jwtToken' is the key where your JWT is stored
            let isAdmin = false;

            if (jwtToken) {
                try {
                    // Decode the token to get the payload
                    // IMPORTANT: This only decodes the token. It does NOT verify the signature.
                    // For true security, JWT signature verification must happen on the server-side.
                    // This client-side check is primarily for immediate UX feedback.
                    const decodedToken: any = jwtDecode(jwtToken);

                    // Check if the decoded token has a 'role' and if it's 'ADMIN'
                    if (decodedToken && decodedToken.role === 'ADMIN') {
                        isAdmin = true;
                    }
                } catch (error) {
                    console.error('Failed to decode JWT token or token is invalid:', error);
                    // Token is invalid or malformed
                }
            }

            if (!isAdmin) {
                // If not an admin, show toast and redirect
                 toast.error('Admin dashboard requires authentication. Please sign in as an admin');
                router.push('/'); // Redirect to home page
            } else {
                setIsAuthenticatedAdmin(true);
            }
            setIsLoading(false); // Authentication check is complete
        };

        checkAdminAuth();
    }, [router, toast]); // Depend on router and toast to re-run if they change (though they typically won't)

    // Show a loading state or nothing until authentication check is complete
    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-background">
                <p className="text-xl text-foreground">Loading admin panel...</p>
            </div>
        );
    }

    // If not authenticated as admin, this component will not render its main content
    // because the useEffect hook will redirect the user. However, this explicit check
    // provides a fallback in case of unexpected rendering before redirection.
    if (!isAuthenticatedAdmin) {
        return null; // Or you could render an "Access Denied" message here if desired
    }

    // Define dashboard navigation items
    const dashboardNavItems = [
        {
            id: 'overview',
            name: 'Dashboard Overview',
            icon: LayoutDashboard,
            component: DashboardOverview, // Placeholder for a future overview component
        },
        {
            id: 'users',
            name: 'Manage Users',
            icon: Users,
            component: ManageUsers,
        },
        {
            id: 'manage-posts',
            name: 'Manage Blog Posts',
            icon: FileText,
            component: ManageBlogPosts,
            route: '/admin/manage-blog' // Link to the external page/component
        },
        {
            id: 'create-post',
            name: 'Create New Post',
            icon: PlusSquare,
            component: CreateBlogPostForm,
            route: '/admin/blog' // Link to the external page/component
        },
        // Add more admin sections here as needed
        // {
        //   id: 'settings',
        //   name: 'Settings',
        //   icon: Settings,
        //   component: () => <div className="p-6 text-center text-muted-foreground">Admin Settings coming soon...</div>,
        // }
    ];

    // Determine which component to render based on activeSection
    const renderContent = () => {
        const item = dashboardNavItems.find(navItem => navItem.id === activeSection);
        if (item) {
            // For items that are external routes, we might just provide a link,
            // or conditionally render them if they are imported components.
            // Here, we're assuming ManageUsers, ManageBlogPosts, CreateBlogPostForm are
            // directly imported components that can be rendered conditionally.
            const ComponentToRender = item.component;
            return <ComponentToRender />;
        }
        return null;
    };

    return (
        <div className="flex min-h-screen bg-background">
            {/* Sidebar */}
            <aside className="w-64 bg-card border-r border-border p-4 fixed h-full overflow-y-auto">
                <h2 className="text-2xl font-bold mb-8 text-center text-primary">Admin Panel</h2>
                <nav className="space-y-2">
                    {dashboardNavItems.map((item) => (
                        <Button
                            key={item.id}
                            variant="ghost"
                            className={cn(
                                "w-full justify-start text-lg px-4 py-3 rounded-lg hover:bg-muted-foreground/10 transition-colors",
                                activeSection === item.id ? "bg-muted-foreground/15 text-primary" : "text-foreground"
                            )}
                            onClick={() => setActiveSection(item.id)}
                            asChild={item.route ? true : false} // Render as Link if it has a route
                        >
                            {item.route ? (
                                <Link href={item.route} className="flex items-center gap-3">
                                    <item.icon className="h-5 w-5" />
                                    <span>{item.name}</span>
                                </Link>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <item.icon className="h-5 w-5" />
                                    <span>{item.name}</span>
                                </div>
                            )}
                        </Button>
                    ))}
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 ml-64 p-8"> {/* Adjusted ml-64 to match sidebar width */}
                {renderContent()}
            </main>
        </div>
    );
}
