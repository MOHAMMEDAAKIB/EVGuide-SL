import { NextResponse } from 'next/server';

/**
 * Deprecated endpoint placeholder.
 *
 * This file exists so Next.js treats the route as a valid module during build.
 * Current auth flow is handled by /auth/callback.
 */
export async function POST() {
	return NextResponse.json(
		{
			error: 'This endpoint is deprecated. Use /auth/callback instead.',
		},
		{ status: 410 }
	);
}

