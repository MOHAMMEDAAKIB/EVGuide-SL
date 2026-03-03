import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database';

/**
 * Auth callback route for handling email verification, password resets, or OAuth flows.
 * Note: Regular email/password login does not use this route.
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');
  const type = requestUrl.searchParams.get('type'); // e.g., 'recovery', 'invite', 'signup'

  // Handle error from Supabase
  if (error) {
    const errorMessage = errorDescription || error;
    console.error('Auth callback error:', errorMessage);
    return NextResponse.redirect(
      `${requestUrl.origin}/login?error=${encodeURIComponent(errorMessage)}`
    );
  }

  // Handle token-based flows (password reset, email verification, etc.)
  if (code) {
    try {
      const cookieStore = await cookies();
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

      const response = NextResponse.next();

      // Create Supabase client with @supabase/ssr cookie handling
      const supabase = createServerClient<Database>(
        supabaseUrl,
        supabaseAnonKey,
        {
          cookies: {
            get(name: string) {
              return cookieStore.get(name)?.value;
            },
            set(name: string, value: string, options: any) {
              response.cookies.set({
                name,
                value,
                ...options,
                path: '/',
                sameSite: 'lax',
              });
            },
            remove(name: string, options: any) {
              response.cookies.set({
                name,
                value: '',
                ...options,
                path: '/',
                maxAge: 0,
              });
            },
          },
        }
      );

      // Exchange code for session
      const { data: { session }, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);

      if (sessionError) {
        console.error('Session exchange error:', sessionError);
        return NextResponse.redirect(
          `${requestUrl.origin}/login?error=${encodeURIComponent(sessionError.message)}`
        );
      }

      if (!session?.user?.email) {
        return NextResponse.redirect(
          `${requestUrl.origin}/login?error=no_session`
        );
      }

      // For password recovery, redirect to a password reset page
      if (type === 'recovery') {
        const redirectResponse = NextResponse.redirect(`${requestUrl.origin}/reset-password`);
        response.cookies.getAll().forEach(cookie => {
          redirectResponse.cookies.set(cookie);
        });
        return redirectResponse;
      }

      // For other flows, verify admin status and redirect to admin panel
      const { data: adminUser, error: adminError } = await supabase
        .from('admin_users')
        .select('is_active')
        .eq('email', session.user.email)
        .eq('is_active', true)
        .single();

      if (adminError || !adminUser) {
        await supabase.auth.signOut();
        return NextResponse.redirect(
          `${requestUrl.origin}/login?error=unauthorized`
        );
      }

      // Success - redirect to admin panel
      const redirectResponse = NextResponse.redirect(`${requestUrl.origin}/admin`);
      response.cookies.getAll().forEach(cookie => {
        redirectResponse.cookies.set(cookie);
      });
      
      return redirectResponse;
    } catch (error) {
      console.error('Auth callback exception:', error);
      return NextResponse.redirect(
        `${requestUrl.origin}/login?error=callback_error`
      );
    }
  }

  // No code - redirect to login
  return NextResponse.redirect(`${requestUrl.origin}/login`);
}
