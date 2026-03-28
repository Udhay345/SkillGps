import { NextResponse } from 'next/server';

// POST /api/admin/login
// Simple auth: any college name + password '12345678'
export async function POST(req: Request) {
    try {
        const { username, password } = await req.json();
        if (username && password === '12345678') {
            return NextResponse.json({
                success: true,
                token: 'ADMIN_TOKEN_SKILLGPS',
                role: 'admin',
                college: username.trim(),
            });
        }
        return NextResponse.json(
            { success: false, message: 'Invalid credentials. Password should be 12345678' },
            { status: 401 }
        );
    } catch {
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}
