import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

// Lists the available categories (id + name) so the UI category picker can
// render dynamically from the database rather than hardcoding names.
export async function GET() {
  try {
    const categories = await db.category.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
