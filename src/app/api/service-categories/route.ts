// File: app/api/service-categories/route.js (for Next.js App Router)
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET all service categories
export async function GET() {
  try {
    const categories = await prisma.serviceCategory.findMany({
      orderBy: {
        name: 'asc',
      },
    });
    
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch service categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch service categories' },
      { status: 500 }
    );
  }
}

// POST new service category
export async function POST(request : any) {
  try {
    const { name, description, imageURL } = await request.json();
    
    // Validate required fields
    if (!name || !description) {
      return NextResponse.json(
        { error: 'Name and description are required' },
        { status: 400 }
      );
    }

    // Check for duplicate name
    const existingCategory = await prisma.serviceCategory.findUnique({
      where: { name },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: 'A service category with this name already exists' },
        { status: 409 }
      );
    }

    // Create new service category
    const newCategory = await prisma.serviceCategory.create({
      data: {
        name,
        description,
        imageURL: imageURL || null, // Handle optional field
      },
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error('Failed to create service category:', error);
    return NextResponse.json(
      { error: 'Failed to create service category' },
      { status: 500 }
    );
  }
}