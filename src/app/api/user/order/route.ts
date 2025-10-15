import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/types/ApiResponse";
import { auth } from "@/lib/auth";

export async function POST(req: Request): Promise<NextResponse<ApiResponse>> {
  try {
    // Get the authenticated user from the session
    const session = await auth(req as any as NextRequest);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    
    // Parse the request body
    const body = await req.json();
    const { address, date, time, services, status, description } = body;
    console.log("Received data:", body);

    if (!address || !date || !time || !Array.isArray(services)) {
      return NextResponse.json(
        { success: false, message: "Invalid input data" },
        { status: 400 }
      );
    }

    console.log("Creating order with date:", new Date(date));
    
    // Step 1: Create a new Order
    const newOrder = await prisma.order.create({
      data: {
        address: address || "",
        date: new Date(date),
        time: time || "",
        status: status || "PENDING", // Use provided status or default to "PENDING"
        userId: userId,
      },
    });

    console.log("New order created:", newOrder);

    // Step 2: Link Services to the Order
    const orderServices = await Promise.all(
      services.map(async (service) => {
        const { id, name, units, cost } = service;
        console.log("Processing service:", service);
        
        if ((!id && !name) || typeof units !== "number" || typeof cost !== "number") {
          throw new Error("Invalid service data");
        }

        // Find the service by ID or name
        let serviceId = id;
        
        if (!serviceId && name) {
          // Find the service by name if ID not provided
          const existingService = await prisma.service.findUnique({
            where: { name },
          });

          if (!existingService) {
            throw new Error(`Service '${name}' not found`);
          }
          
          serviceId = existingService.id;
        }

        // Create OrderService entry
        return prisma.orderService.create({
          data: {
            serviceId,
            orderId: newOrder.id,
            units,
            cost,
          },
        });
      })
    );

    return NextResponse.json(
      { success: true, message: "Order created successfully", order: newOrder, orderServices },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}


// import prisma from "@/lib/prisma";
// import { NextResponse } from "next/server";
// import { ApiResponse } from "@/types/ApiResponse";

// export async function POST(req: Request): Promise<NextResponse<ApiResponse>> {
//   try {
//     const body = await req.json();
//     const { address, date, time, services, userId, status, description } = body;
//     console.log("Received data:", body);

//     // THIS IS THE BUG: The condition is checking "if status" instead of checking if it's missing
//     // Original: if (!address || !date || !time || !Array.isArray(services) || !userId || status)
//     // The "status" part should be checking if it's missing, not if it exists
//     if (!address || !date || !time || !Array.isArray(services) || !userId) {
//       return NextResponse.json(
//         { success: false, message: "Invalid input data" },
//         { status: 400 }
//       );
//     }

//     console.log("Creating order with date:", new Date(date));
    
//     // Step 1: Create a new Order
//     const newOrder = await prisma.order.create({
//       data: {
//         address: address || "",
//         date: new Date(date),
//         time: time || "",
//         status: status || "PENDING", // Use provided status or default to "PENDING"
//         userId: userId,
//       },
//     });

//     console.log("New order created:", newOrder);

//     // Step 2: Link Services to the Order
//     const orderServices = await Promise.all(
//       services.map(async (service) => {
//         const { id, name, units, cost } = service;
//         console.log("Processing service:", service);
        
//         if ((!id && !name) || typeof units !== "number" || typeof cost !== "number") {
//           throw new Error("Invalid service data");
//         }

//         // Find the service by ID or name
//         let serviceId = id;
        
//         if (!serviceId && name) {
//           // Find the service by name if ID not provided
//           const existingService = await prisma.service.findUnique({
//             where: { name },
//           });

//           if (!existingService) {
//             throw new Error(`Service '${name}' not found`);
//           }
          
//           serviceId = existingService.id;
//         }

//         // Create OrderService entry
//         return prisma.orderService.create({
//           data: {
//             serviceId,
//             orderId: newOrder.id,
//             units,
//             cost,
//           },
//         });
//       })
//     );

//     return NextResponse.json(
//       { success: true, message: "Order created successfully", order: newOrder, orderServices },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Error creating order:", error);
//     return NextResponse.json(
//       { success: false, message: error instanceof Error ? error.message : "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

// Shrijan's code  :" 

// import prisma from "@/lib/prisma";
// import { NextResponse } from "next/server";
// import { ApiResponse } from "@/types/ApiResponse";

// export async function POST(req: Request): Promise<NextResponse<ApiResponse>> {
//   try {
//     const body = await req.json();
//     const { address, date, time, services, userId, status } = body;
//     console.log("Received data:", body);

//     if (!address || !date || !time || !Array.isArray(services) || !userId || status) {
//       return NextResponse.json(
//         { success: false, message: "Invalid input data" },
//         { status: 400 }
//       );
//     }

//     console.log(new Date(date));
    
//     // Step 1: Create a new Order
//     const newOrder = await prisma.order.create({
//       data: {
//         address: address || "",
//         date: new Date(date),
//         time: time || "",
//         status: status || "PENDING",
//         userId: userId,
//       },
//     });

//     //console.log("New order created:", newOrder);

//     // Step 2: Link Services to the Order
//     const orderServices = await Promise.all(
//       services.map(async (service) => {
//         const { name, units, cost } = service;
//         console.log("Processing service:", service);
        
//         if (!name || typeof units !== "number" || typeof cost !== "number") {
//           throw new Error("Invalid service data");
//         }

//         // Find the service by name
//         const existingService = await prisma.service.findUnique({
//           where: { name },
//         });

//         if (!existingService) {
//           throw new Error(`Service '${name}' not found`);
//         }

//         // Create OrderService entry
//         return prisma.orderService.create({
//           data: {
//             serviceId: existingService.id,
//             orderId: newOrder.id,
//             units,
//             cost,
//           },
//         });
//       })
//     );

//     return NextResponse.json(
//       { success: true, message: "Order created successfully", order: newOrder, orderServices },
//       { status: 201 }
//     );
//   } catch (error) {
//     //console.error(error);
//     return NextResponse.json(
//       { success: false, message: error instanceof Error ? error.message : "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

// create a basic api to check if the route is working properly

// import { NextResponse } from "next/server";
// import { ApiResponse } from "@/types/ApiResponse";

// export async function GET(req: Request): Promise<NextResponse<ApiResponse>> {
//   return NextResponse.json(
//     { success: true, message: "API is working properly" },
//     { status: 200 }
//   );
// }



// Other code to review : 



// import { NextRequest, NextResponse } from "next/server";
// import { auth } from "@/lib/auth";
// import prisma from "@/lib/prisma";
// import { ApiResponse } from "@/types/ApiResponse";
// import { sendNotification } from "@/lib/notifications";

// export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
//   try {
//     // Get authenticated user
//     const session = await auth();
    
//     if (!session?.user?.id) {
//       return NextResponse.json(
//         { success: false, message: "Unauthorized: Please log in" },
//         { status: 401 }
//       );
//     }

//     // Parse request body
//     const data = await request.json();
//     const { 
//       services, 
//       address, 
//       addressId,
//       date, 
//       time, 
//       description, 
//       status = "PENDING" 
//     } = data;

//     // Validate required fields
//     if (!services || !Array.isArray(services) || services.length === 0) {
//       return NextResponse.json(
//         { success: false, message: "No services selected" },
//         { status: 400 }
//       );
//     }

//     if (!address) {
//       return NextResponse.json(
//         { success: false, message: "Service address is required" },
//         { status: 400 }
//       );
//     }

//     if (!date || !time) {
//       return NextResponse.json(
//         { success: false, message: "Service date and time are required" },
//         { status: 400 }
//       );
//     }

//     // Calculate total amount
//     const totalAmount = services.reduce(
//       (sum: number, service: any) => sum + (service.cost || 0),
//       0
//     );

//     // Create order
//     const order = await prisma.order.create({
//       data: {
//         userId: session.user.id,
//         address,
//         addressId,
//         scheduledDate: new Date(date),
//         scheduledTime: time,
//         totalAmount,
//         description,
//         status,
//         paymentStatus: "PENDING",
//         paymentMethod: "COD", // Default to Cash on Delivery
//         items: {
//           create: services.map((service: any) => ({
//             serviceId: service.id,
//             serviceName: service.name,
//             quantity: service.units,
//             unitPrice: service.cost / service.units,
//             totalPrice: service.cost,
//           })),
//         },
//       },
//       include: {
//         items: true,
//       },
//     });

//     // Send notification to user
//     await sendNotification({
//       userId: session.user.id,
//       title: "Service Scheduled",
//       message: `Your service has been scheduled for ${time} on ${new Date(date).toLocaleDateString()}`,
//       type: "ORDER_CREATED",
//       metadata: {
//         orderId: order.id,
//       },
//     });

//     // Send notification to admin (simplified)
//     await prisma.notification.create({
//       data: {
//         userId: "admin", // Assuming admin user ID or use appropriate admin ID
//         title: "New Service Order",
//         message: `A new service order (ID: ${order.id}) has been placed`,
//         type: "NEW_ORDER",
//         metadata: {
//           orderId: order.id,
//         },
//       },
//     });

//     return NextResponse.json({
//       success: true,
//       message: "Service scheduled successfully",
//       order: {
//         id: order.id,
//         scheduledDate: order.scheduledDate,
//         scheduledTime: order.scheduledTime,
//         totalAmount: order.totalAmount,
//         status: order.status,
//       },
//     });
//   } catch (error) {
//     console.error("Error creating order:", error);
//     return NextResponse.json(
//       { success: false, message: "Failed to schedule service" },
//       { status: 500 }
//     );
//   }
// }

// export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse>> {
//   try {
//     // Get authenticated user
//     const session = await auth();
    
//     if (!session?.user?.id) {
//       return NextResponse.json(
//         { success: false, message: "Unauthorized: Please log in" },
//         { status: 401 }
//       );
//     }

//     // Extract order ID from the URL if present
//     const url = new URL(request.url);
//     const orderId = url.searchParams.get('id');

//     if (orderId) {
//       // Get single order
//       const order = await prisma.order.findUnique({
//         where: {
//           id: orderId,
//           userId: session.user.id,
//         },
//         include: {
//           items: true,
//           provider: {
//             select: {
//               id: true,
//               user: {
//                 select: {
//                   name: true,
//                   image: true,
//                   phone: true,
//                 }
//               },
//               rating: true,
//             }
//           }
//         },
//       });

//       if (!order) {
//         return NextResponse.json(
//           { success: false, message: "Order not found" },
//           { status: 404 }
//         );
//       }

//       return NextResponse.json({
//         success: true,
//         order,
//       });
//     } else {
//       // Get list of orders with pagination
//       const page = parseInt(url.searchParams.get('page') || '1');
//       const limit = parseInt(url.searchParams.get('limit') || '10');
//       const status = url.searchParams.get('status') || undefined;
      
//       const skip = (page - 1) * limit;

//       const [orders, totalCount] = await Promise.all([
//         prisma.order.findMany({
//           where: {
//             userId: session.user.id,
//             status: status ? status : undefined,
//           },
//           orderBy: {
//             createdAt: 'desc',
//           },
//           skip,
//           take: limit,
//           include: {
//             items: true,
//             provider: {
//               select: {
//                 user: {
//                   select: {
//                     name: true,
//                     image: true,
//                   }
//                 }
//               }
//             }
//           },
//         }),
//         prisma.order.count({
//           where: {
//             userId: session.user.id,
//             status: status ? status : undefined,
//           },
//         }),
//       ]);

//       return NextResponse.json({
//         success: true,
//         orders,
//         pagination: {
//           page,
//           limit,
//           totalCount,
//           totalPages: Math.ceil(totalCount / limit),
//         },
//       });
//     }
//   } catch (error) {
//     console.error("Error fetching orders:", error);
//     return NextResponse.json(
//       { success: false, message: "Failed to retrieve orders" },
//       { status: 500 }
//     );
//   }
// }