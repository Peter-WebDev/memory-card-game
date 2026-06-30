import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// Default category served when no ?category= is provided (e.g. first page
// load and the Cypress E2E flow, which visit '/' without selecting one).
const DEFAULT_CATEGORY = 'Food & Drink';

export async function GET(request: NextRequest) {
  try {
    const categoryName =
      request.nextUrl.searchParams.get('category') || DEFAULT_CATEGORY;

    const category = await db.category.findUnique({
      where: { name: categoryName },
      include: { assets: true },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(category.assets);
  } catch (error) {
    console.error('Error fetching assets:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
