// File: app/api/services/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all services with optional filtering
export async function GET(request : any) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    
    const whereClause = categoryId 
      ? { serviceCategoryId: categoryId } 
      : {};
    
    const services = await prisma.service.findMany({
      where: whereClause,
      include: {
        serviceCategory: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
    
    return NextResponse.json(services, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

// POST a new service
export async function POST(request : any) {
  try {
    const { name, description, serviceCategoryId, amount, imageURL } = await request.json();
    
    // Validate required fields
    if (!name || !description || !serviceCategoryId) {
      return NextResponse.json(
        { error: 'Name, description, and service category are required' },
        { status: 400 }
      );
    }

    // Validate category exists
    const categoryExists = await prisma.serviceCategory.findUnique({
      where: { id: serviceCategoryId },
    });

    if (!categoryExists) {
      return NextResponse.json(
        { error: 'Service category not found' },
        { status: 404 }
      );
    }

    // Check for duplicate name
    const existingService = await prisma.service.findUnique({
      where: { name },
    });

    if (existingService) {
      return NextResponse.json(
        { error: 'A service with this name already exists' },
        { status: 409 }
      );
    }

    // Create new service
    const newService = await prisma.service.create({
      data: {
        name,
        description,
        serviceCategoryId,
        amount: parseFloat(amount) || 0,
        imageURL: imageURL || null,
      },
      include: {
        serviceCategory: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(newService, { status: 201 });
  } catch (error) {
    console.error('Failed to create service:', error);
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    );
  }
}