// components/AdminDashboard.jsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, LayoutDashboard, FileText, PlusSquare, Settings } from 'lucide-react'; // Icons for navigation
import { cn } from '@/lib/utils'; // Assuming you have a utility for class names

// Import the components that will be rendered inside the dashboard
import { ManageUsers } from './ManageUsers';
import { ManageBlogPosts } from './ManageBlogs'; // Your existing component
import { CreateBlogPostForm } from './createBlogPost'; // Your existing component
import { Button } from './ui/button';
import { DashboardOverview } from './DashbordOverview';

export function AdminDashboard() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string>('users'); // Default to 'users'

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
