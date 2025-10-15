// Modified /api/user/fetchOrder.ts
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { OrderStatus } from "@prisma/client";

interface OrdersApiResponse {
  success: boolean;
  message: string;
  orders?: any[];
  count?: number;
}

export async function GET(req: Request): Promise<NextResponse<OrdersApiResponse>> {
  try {
    // Verify authentication
    const session = await auth(req as any as NextRequest);
    
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Get query parameters
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const status = searchParams.get("status") as OrderStatus | null;
    
    // Ensure user can only access their own orders
    if (userId !== session.user.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized to access this user's orders" },
        { status: 403 }
      );
    }

    // Build where clause based on provided parameters
    const whereClause: any = { userId };
    
    // Add status filter if provided
    if (status) {
      whereClause.status = status;
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        orderServices: {
          include: {
            service: {
              include: {
                serviceCategory: true, // Include the service category
              },
            },
          },
        },
      },
      orderBy: {
        date: 'desc', // Sort by date, most recent first
      },
    });

    return NextResponse.json(
      { 
        success: true, 
        message: "Orders fetched successfully", 
        orders,
        count: orders.length
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}