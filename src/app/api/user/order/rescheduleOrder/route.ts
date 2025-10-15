// app/api/order/rescheduleOrder/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    // Verify user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ 
        success: false, 
        message: "Unauthorized" 
      }, { status: 401 });
    }

    // Parse request body
    const { orderId, date, time } = await req.json();

    // Validate request data
    if (!orderId || !date || !time) {
      return NextResponse.json({ 
        success: false, 
        message: "Missing required fields" 
      }, { status: 400 });
    }

    // Find the order and verify ownership
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { booking: true }
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
        message: "You do not have permission to modify this order" 
      }, { status: 403 });
    }

    // Verify order is in a state that can be rescheduled
    if (!["PENDING", "BOOKED"].includes(order.status)) {
      return NextResponse.json({ 
        success: false, 
        message: `Cannot reschedule an order with status: ${order.status}` 
      }, { status: 400 });
    }

    // Convert date string to Date object
    const scheduledDate = new Date(date);

    // Update the order with new date and time
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        date: scheduledDate,
        time: time,
      },
    });

    // If there's an associated booking, update its scheduledAt as well
    if (order.booking) {
      await prisma.booking.update({
        where: { id: order.booking.id },
        data: {
          scheduledAt: scheduledDate,
        },
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Order rescheduled successfully",
      order: updatedOrder
    });
  } catch (error) {
    console.error("Error rescheduling order:", error);
    return NextResponse.json({ 
      success: false, 
      message: "An error occurred while rescheduling the order" 
    }, { status: 500 });
  }
}