import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { Database } from '@/types/database';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes
  if (pathname.startsWith('/admin')) {
    try {
      let response = NextResponse.next({
        request: {
          headers: request.headers,
        },
      });

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

      // Create Supabase client with @supabase/ssr for consistent cookie handling
      const supabase = createServerClient<Database>(
        supabaseUrl,
        supabaseAnonKey,
        {
          cookies: {
            get(name: string) {
              return request.cookies.get(name)?.value;
            },
            set(name: string, value: string, options: any) {
              response.cookies.set({ name, value, ...options });
            },
            remove(name: string, options: any) {
              response.cookies.set({ name, value: '', ...options });
            },
          },
        }
      );

      // Use getUser() instead of getSession() for proper JWT validation
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user || !user.email) {
        // No valid user - redirect to login
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }

      // Verify user is an active admin
      const { data: adminUser, error: adminError } = await supabase
        .from('admin_users')
        .select('is_active')
        .eq('email', user.email)
        .eq('is_active', true)
        .single();

      if (adminError || !adminUser) {
        // Not an admin or inactive - redirect to login with error
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('error', 'unauthorized');
        return NextResponse.redirect(loginUrl);
      }

      // User is authenticated and is an admin - allow access
      return response;
    } catch (error) {
      console.error('Middleware error:', error);
      // On error, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // For all other routes, allow access
  return NextResponse.next();
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    '/admin/:path*',
  ],
};
