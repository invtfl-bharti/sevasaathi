// app/api/order/getOrder/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    // Verify user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ 
        success: false, 
        message: "Unauthorized" 
      }, { status: 401 });
    }

    // Get orderId from query parameters
    const url = new URL(req.url);
    const orderId = url.searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json({ 
        success: false, 
        message: "Order ID is required" 
      }, { status: 400 });
    }

    // Fetch the order with all related services
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderServices: {
          include: {
            service: {
              include: {
                serviceCategory: true
              }
            }
          }
        }
      }
    });

    if (!order) {
      return NextResponse.json({ 
        success: false, 
        message: "Order not found" 
      }, { status: 404 });
    }

    // Verify the user owns this order
    if (order.userId !== session.user.id) {
      return NextResponse.json({ 
        success: false, 
        message: "You do not have permission to access this order" 
      }, { status: 403 });
    }

    return NextResponse.json({ 
      success: true, 
      order 
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json({ 
      success: false, 
      message: "An error occurred while fetching the order" 
    }, { status: 500 });
  }
}