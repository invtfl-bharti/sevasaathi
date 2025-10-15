// File: app/api/service-categories/[id]/route.js (for handling individual service categories)
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET a specific service category by ID
export async function GET(request :any, { params } : any) {
  try {
    const { id } = params;
    
    const category = await prisma.serviceCategory.findUnique({
      where: { id },
      include: {
        services: true, // Include related services if needed
      },
    });
    
    if (!category) {
      return NextResponse.json(
        { error: 'Service category not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch service category:', error);
    return NextResponse.json(
      { error: 'Failed to fetch service category' },
      { status: 500 }
    );
  }
}

// PUT/PATCH to update a service category
export async function PATCH(request :any, { params } : any) {
  try {
    const { id } = params;
    const { name, description, imageURL } = await request.json();
    
    // Check if category exists
    const existingCategory = await prisma.serviceCategory.findUnique({
      where: { id },
    });
    
    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Service category not found' },
        { status: 404 }
      );
    }
    
    // Check for duplicate name if name is being changed
    if (name && name !== existingCategory.name) {
      const duplicateName = await prisma.serviceCategory.findUnique({
        where: { name },
      });
      
      if (duplicateName) {
        return NextResponse.json(
          { error: 'A service category with this name already exists' },
          { status: 409 }
        );
      }
    }
    
    // Update the category
    const updatedCategory = await prisma.serviceCategory.update({
      where: { id },
      data: {
        name: name || existingCategory.name,
        description: description || existingCategory.description,
        imageURL: imageURL !== undefined ? imageURL : existingCategory.imageURL,
      },
    });
    
    return NextResponse.json(updatedCategory, { status: 200 });
  } catch (error) {
    console.error('Failed to update service category:', error);
    return NextResponse.json(
      { error: 'Failed to update service category' },
      { status: 500 }
    );
  }
}

// DELETE a service category
export async function DELETE(request : any, { params } : any) {
  try {
    const { id } = params;
    
    // Check if category exists
    const existingCategory = await prisma.serviceCategory.findUnique({
      where: { id },
      include: {
        services: {
          select: { id: true },
        },
      },
    });
    
    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Service category not found' },
        { status: 404 }
      );
    }
    
    // Check if category has associated services
    if (existingCategory.services.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with associated services' },
        { status: 400 }
      );
    }
    
    // Delete the category
    await prisma.serviceCategory.delete({
      where: { id },
    });
    
    return NextResponse.json(
      { message: 'Service category deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to delete service category:', error);
    return NextResponse.json(
      { error: 'Failed to delete service category' },
      { status: 500 }
    );
  }
}