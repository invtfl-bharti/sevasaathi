// File: app/api/services/[id]/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET a specific service by ID
export async function GET(request :any, { params }:any) {
  try {
    const { id } = params;
    
    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        serviceCategory: true,
      },
    });
    
    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(service, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch service:', error);
    return NextResponse.json(
      { error: 'Failed to fetch service' },
      { status: 500 }
    );
  }
}

// UPDATE a service
export async function PATCH(request:any, { params }:any) {
  try {
    const { id } = params;
    const { name, description, serviceCategoryId, amount, imageURL } = await request.json();
    
    // Check if service exists
    const existingService = await prisma.service.findUnique({
      where: { id },
    });
    
    if (!existingService) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }
    
    // Check for duplicate name if name is being changed
    if (name && name !== existingService.name) {
      const duplicateName = await prisma.service.findUnique({
        where: { name },
      });
      
      if (duplicateName) {
        return NextResponse.json(
          { error: 'A service with this name already exists' },
          { status: 409 }
        );
      }
    }
    
    // Validate service category if it's being updated
    if (serviceCategoryId && serviceCategoryId !== existingService.serviceCategoryId) {
      const categoryExists = await prisma.serviceCategory.findUnique({
        where: { id: serviceCategoryId },
      });
      
      if (!categoryExists) {
        return NextResponse.json(
          { error: 'Service category not found' },
          { status: 404 }
        );
      }
    }
    
    // Update the service
    const updatedService = await prisma.service.update({
      where: { id },
      data: {
        name: name || existingService.name,
        description: description || existingService.description,
        serviceCategoryId: serviceCategoryId || existingService.serviceCategoryId,
        amount: amount !== undefined ? parseFloat(amount) : existingService.amount,
        imageURL: imageURL !== undefined ? imageURL : existingService.imageURL,
      },
      include: {
        serviceCategory: true,
      },
    });
    
    return NextResponse.json(updatedService, { status: 200 });
  } catch (error) {
    console.error('Failed to update service:', error);
    return NextResponse.json(
      { error: 'Failed to update service' },
      { status: 500 }
    );
  }
}

// DELETE a service
export async function DELETE(request:any, { params }:any) {
  try {
    const { id } = params;
    
    // Check if service exists
    const existingService = await prisma.service.findUnique({
      where: { id },
      include: {
        orderServices: {
          select: { id: true },
        },
      },
    });
    
    if (!existingService) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }
    
    // Check if service has associated orders
    if (existingService.orderServices.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete service with associated orders' },
        { status: 400 }
      );
    }
    
    // Delete the service
    await prisma.service.delete({
      where: { id },
    });
    
    return NextResponse.json(
      { message: 'Service deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to delete service:', error);
    return NextResponse.json(
      { error: 'Failed to delete service' },
      { status: 500 }
    );
  }
}