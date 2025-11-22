import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Missing email or password' },
        { status: 400 }
      );
    }

    // 1. Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return NextResponse.json(
        { success: false, message: authError.message },
        { status: 401 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { success: false, message: 'Login failed' },
        { status: 500 }
      );
    }

    // 2. Fetch user role from public users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', authData.user.id)
      .single();

    if (userError) {
      console.error('Error fetching user role:', userError);
      // Proceeding without role or default to applicant if critical
    }

    return NextResponse.json({
      success: true,
      token: authData.session?.access_token,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        role: userData?.role || 'applicant',
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
