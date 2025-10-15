// File: app/api/location/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getIO } from "@/lib/socket";
import { calculateDistance } from "@/lib/geolocation";
import { ApiResponse } from "@/types/ApiResponse";

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    // Get authenticated user
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Please log in" },
        { status: 401 }
      );
    }
    
    // Get user with optimized query - select only needed fields
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        role: true,
        captain: {
          select: {
            id: true
          }
        }
      }
    });
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    
    // Parse the request body
    const data = await request.json();
    const { latitude, longitude, city } = data;
    
    // Validate coordinates
    if (!latitude || !longitude || typeof latitude !== 'number' || typeof longitude !== 'number') {
      return NextResponse.json(
        { success: false, message: "Invalid location data: Valid coordinates are required" },
        { status: 400 }
      );
    }
    
    // If user is a captain, update the Location model
    if (user.role === "CAPTAIN" && user.captain) {
      // Update location in database
      const updatedLocation = await prisma.location.upsert({
        where: { captainId: user.captain.id },
        update: {
          latitude,
          longitude,
          city: city || undefined,
          updatedAt: new Date(),
        },
        create: {
          captainId: user.captain.id,
          latitude,
          longitude,
          city: city || "Unknown",
        },
      });
      
      // Get active trips for this captain
      const activeTrips = await prisma.trip.findMany({
        where: {
          captainId: user.id,
          status: {
            in: ["ACCEPTED", "IN_PROGRESS"]
          }
        },
        select: {
          id: true,
          userId: true,
          status: true
        }
      });
      
      // Update all active trips
      for (const trip of activeTrips) {
        // Get the user's location (simplified example)
        // In a real app, you might get this from the trip pickup coordinates
        const userLocation = {
          latitude: 0, // Replace with actual user latitude
          longitude: 0, // Replace with actual user longitude
        };
        
        // Calculate distance to user
        const distanceToUser = calculateDistance(
          latitude,
          longitude,
          userLocation.latitude,
          userLocation.longitude
        );
        
        // Update trip with new location
        await prisma.trip.update({
          where: { id: trip.id },
          data: {
            captainLatitude: latitude,
            captainLongitude: longitude,
            distanceToUser,
            lastLocationUpdate: new Date(),
            // Auto-update status if captain is close enough
            status: distanceToUser < 0.05 ? "ARRIVED" : trip.status,
          }
        });
        
        // Create location tracking history
        await prisma.locationTracking.create({
          data: {
            tripId: trip.id,
            userId: trip.userId,
            latitude,
            longitude,
            distanceToUser,
          }
        });
        
        // Send real-time update via Socket.IO if available
        const io = getIO();
        if (io) {
          io.to(`user_${trip.userId}`).emit('captain_location_update', {
            tripId: trip.id,
            captainId: user.captain.id,
            latitude,
            longitude,
            distanceToUser,
            status: distanceToUser < 0.05 ? "ARRIVED" : trip.status,
            timestamp: new Date(),
            estimatedArrivalMinutes: Math.round((distanceToUser / 30) * 60) // Assuming 30 km/h average speed
          });
        }
      }
    }
    
    return NextResponse.json({
      success: true,
      message: "Location updated successfully",
      location: {
        latitude,
        longitude,
        city: city || "Unknown",
        updatedAt: new Date(),
      }
    });
    
  } catch (error) {
    console.error("Error updating location:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update location" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    // Get authenticated user
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Please log in" },
        { status: 401 }
      );
    }
    
    // Fetch user with optimized query
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        role: true,
        captain: {
          select: {
            id: true
          }
        }
      }
    });
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    
    // If user is a captain, fetch their location
    if (user.role === "CAPTAIN" && user.captain) {
      const location = await prisma.location.findUnique({
        where: { captainId: user.captain.id },
        select: {
          latitude: true,
          longitude: true,
          city: true,
          updatedAt: true
        }
      });
      
      if (!location) {
        return NextResponse.json(
          { success: false, message: "No location data found for this captain" },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        success: true,
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
          city: location.city,
          updatedAt: location.updatedAt
        }
      });
    } else {
      // For regular users, check their active trips
      const activeTrip = await prisma.trip.findFirst({
        where: {
          userId: user.id,
          status: {
            in: ["ACCEPTED", "IN_PROGRESS", "ARRIVED"]
          }
        },
        orderBy: {
          createdAt: "desc"
        },
        select: {
          id: true,
          captainId: true,
          captainLatitude: true,
          captainLongitude: true,
          distanceToUser: true,
          lastLocationUpdate: true,
          status: true
        }
      });
      
      if (!activeTrip || !activeTrip.captainLatitude || !activeTrip.captainLongitude) {
        return NextResponse.json(
          { success: false, message: "No active trip or location data found" },
          { status: 404 }
        );
      }
      
      // Calculate ETA
      const etaMinutes = activeTrip.distanceToUser 
        ? Math.round((activeTrip.distanceToUser / 30) * 60) // Assuming 30 km/h
        : null;
      
      return NextResponse.json({
        success: true,
        location: {
          tripId: activeTrip.id,
          latitude: activeTrip.captainLatitude,
          longitude: activeTrip.captainLongitude,
          distanceToUser: activeTrip.distanceToUser,
          status: activeTrip.status,
          updatedAt: activeTrip.lastLocationUpdate,
          estimatedArrivalMinutes: etaMinutes
        }
      });
    }
    
  } catch (error) {
    console.error("Error fetching location:", error);
    return NextResponse.json(
      { success: false, message: "Failed to retrieve location data" },
      { status: 500 }
    );
  }
}