import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');

  // Handle error from Supabase
  if (error) {
    return NextResponse.redirect(
      `${requestUrl.origin}/login?error=${encodeURIComponent(errorDescription || error)}`
    );
  }

  if (code) {
    try {
      const cookieStore = await cookies();
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

      // Create response first so we can set cookies on it
      const response = NextResponse.next();

      // Create a Supabase client with cookie handling that writes to response
      const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          flowType: 'pkce',
        },
        global: {
          headers: {
            'X-Client-Info': 'supabase-js-callback',
          },
        },
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            // Set cookie in the response
            response.cookies.set({
              name,
              value,
              ...options,
              path: '/',
              sameSite: 'lax',
            });
          },
          remove(name: string, options: any) {
            // Remove cookie from the response
            response.cookies.set({
              name,
              value: '',
              ...options,
              path: '/',
              maxAge: 0,
            });
          },
        },
      } as any);

      // Exchange the code for a session
      const { data: { session }, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);

      if (sessionError) {
        console.error('Session exchange error:', sessionError);
        return NextResponse.redirect(
          `${requestUrl.origin}/login?error=${encodeURIComponent(sessionError.message)}`
        );
      }

      if (!session?.user?.email) {
        console.error('No session or email after exchange');
        return NextResponse.redirect(
          `${requestUrl.origin}/login?error=no_email`
        );
      }

      console.log('Session established for:', session.user.email);

      // Verify the user is an admin
      const { data: adminUser, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', session.user.email)
        .eq('is_active', true)
        .single();

      if (adminError || !adminUser) {
        console.error('Admin verification failed:', adminError || 'User not found in admin_users');
        // Not an admin - sign them out and redirect with error
        await supabase.auth.signOut();
        return NextResponse.redirect(
          `${requestUrl.origin}/login?error=unauthorized`
        );
      }

      console.log('Admin verified, redirecting to /admin');

      // Success - create redirect response with cookies
      const redirectResponse = NextResponse.redirect(`${requestUrl.origin}/admin`);
      
      // Copy all cookies from the response to the redirect response
      response.cookies.getAll().forEach(cookie => {
        redirectResponse.cookies.set(cookie);
      });
      
      return redirectResponse;
    } catch (error) {
      console.error('Auth callback error:', error);
      return NextResponse.redirect(
        `${requestUrl.origin}/login?error=callback_error`
      );
    }
  }

  // No code provided
  return NextResponse.redirect(`${requestUrl.origin}/login`);
}
