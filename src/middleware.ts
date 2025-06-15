// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose'; // For JWT verification in Edge Runtime

// Define your JWT secret
// IMPORTANT: This must match the secret used in your backend!
// Get this from environment variables.
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'Murali222');

console.log('JWT_SECRET:', JWT_SECRET); // Debugging line to check if the secret is set correctly

// Define your routes
const publicRoutes = ['/', '/about', '/contact', '/blog', '/blog/(.*)']; // Include dynamic blog post routes
const authRoutes = ['/signin', '/signup'];
const adminRoutes = ['/admin', '/admin/(.*)']; // Protect all routes under /admin

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const jwtToken = request.cookies.get('jwtToken')?.value;
  console.log('JWT Token from request:', jwtToken); // Debugging line to check the JWT token

  // Assume user is not authenticated by default
  let isAuthenticated = false;
  let userRole: string | null = null;

  if (jwtToken) {
    try {
      const { payload } = await jwtVerify(jwtToken, JWT_SECRET);
      console.log('JWT payload:', payload); // Debugging line to check the JWT payload
      isAuthenticated = true;
      userRole = payload.role as string; // Assert the type of role
    } catch (error) {
      console.error('JWT verification failed in middleware:', error);
      // If token is invalid/expired, treat as unauthenticated
      isAuthenticated = false;
      userRole = null;
      // Optionally clear the invalid cookie directly from the response
      const response = NextResponse.next();
      response.cookies.delete('jwtToken');
      return response;
    }
  }

  // --- Handle Authentication Routes (signin, signup) ---
  const isAuthRoute = authRoutes.some(route => path.startsWith(route));
  if (isAuthRoute) {
    if (isAuthenticated) {
      // If authenticated user tries to access signin/signup, redirect to home or dashboard
      return NextResponse.redirect(new URL('/', request.url));
    }
    // If not authenticated, allow access to signin/signup
    return NextResponse.next();
  }

  // --- Handle Admin Routes ---
  const isAdminRoute = adminRoutes.some(route => path.startsWith(route));
  if (isAdminRoute) {
    if (!isAuthenticated) {
      // If not authenticated, redirect to signin
      return NextResponse.redirect(new URL('/signin', request.url));
    }
    if (userRole !== 'ADMIN') {
      // If authenticated but not an admin, redirect to home or unauthorized page
      // toast.error('Unauthorized access. Admin privileges required.'); // This toast won't work server-side
      return NextResponse.redirect(new URL('/', request.url)); // Or a specific /unauthorized page
    }
    // If authenticated and is admin, allow access
    return NextResponse.next();
  }

  // --- Handle Protected Routes (e.g., if you had /dashboard that non-admins can access but requires login) ---
  // Example: if (!isAuthenticated && protectedRoutes.includes(path)) {
  //   return NextResponse.redirect(new URL('/signin', request.url));
  // }

  // For all other public routes or authenticated non-admin users on public routes, allow access
  return NextResponse.next();
}

// Define routes to apply the middleware to
export const config = {
  matcher: [
    '/signin',
    '/signup',
    '/admin/:path*', // Match /admin and all sub-paths
    // Add other protected routes here if any, e.g., '/dashboard', '/profile'
  ],
};
