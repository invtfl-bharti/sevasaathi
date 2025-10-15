// File: app/api/geocoding/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { ApiResponse } from "@/types/ApiResponse";

// For reverse geocoding
const GEOCODING_API_URL = "https://maps.googleapis.com/maps/api/geocode/json";
const GEOCODING_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    // Get authenticated user
    // const session = await auth();
    
    // if (!session?.user?.id) {
    //   return NextResponse.json(
    //     { success: false, message: "Unauthorized: Please log in" },
    //     { status: 401 }
    //   );
    // }
    
    // Get coordinates from query parameters
    const url = new URL(request.url);
    const latitude = url.searchParams.get('latitude');
    const longitude = url.searchParams.get('longitude');
    
    // Validate required parameters
    if (!latitude || !longitude) {
      return NextResponse.json(
        { success: false, message: "Missing required parameters: latitude and longitude" },
        { status: 400 }
      );
    }
    
    // Check if API key is configured
    if (!GEOCODING_API_KEY) {
      return NextResponse.json(
        { success: false, message: "Geocoding API key is not configured" },
        { status: 500 }
      );
    }
    
    // Use Google Maps Geocoding API to get address from coordinates
    const response = await fetch(
      `${GEOCODING_API_URL}?latlng=${latitude},${longitude}&key=${GEOCODING_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.status !== "OK" || !data.results || data.results.length === 0) {
      return NextResponse.json(
        { success: false, message: "Could not find address for this location" },
        { status: 404 }
      );
    }
    
    // Get the most accurate address result
    const addressResult = data.results[0];
    
    // Format the address components
    const formattedAddress = addressResult.formatted_address;
    
    // Extract city/locality info
    let city = "Unknown";
    for (const component of addressResult.address_components) {
      if (component.types.includes("locality") || component.types.includes("administrative_area_level_2")) {
        city = component.long_name;
        break;
      }
    }
    
    return NextResponse.json({
      success: true,
      address: {
        formattedAddress,
        city,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        placeId: addressResult.place_id,
        components: addressResult.address_components
      }
    });
    
  } catch (error) {
    console.error("Error in reverse geocoding:", error);
    return NextResponse.json(
      { success: false, message: "Failed to get address from coordinates" },
      { status: 500 }
    );
  }
}


// import { NextRequest, NextResponse } from "next/server";
// import { auth } from "@/lib/auth";
// import prisma from "@/lib/prisma";
// import { ApiResponse } from "@/types/ApiResponse";

// // For reverse geocoding
// const GEOCODING_API_URL = "https://maps.googleapis.com/maps/api/geocode/json";
// const GEOCODING_API_KEY = process.env.GOOGLE_MAPS_API_KEY || "";

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
    
//     // Check for reverse geocoding request (convert coordinates to address)
//     const url = new URL(request.url);
//     const latitude = url.searchParams.get('latitude');
//     const longitude = url.searchParams.get('longitude');
    
//     // If latitude and longitude are provided, perform reverse geocoding
//     if (latitude && longitude) {
//       try {
//         // Use Google Maps Geocoding API to get address from coordinates
//         if (!GEOCODING_API_KEY) {
//           return NextResponse.json(
//             { success: false, message: "Geocoding API key is not configured" },
//             { status: 500 }
//           );
//         }
        
//         const response = await fetch(
//           `${GEOCODING_API_URL}?latlng=${latitude},${longitude}&key=${GEOCODING_API_KEY}`
//         );
        
//         if (!response.ok) {
//           throw new Error(`Geocoding API error: ${response.statusText}`);
//         }
        
//         const data = await response.json();
        
//         if (data.status !== "OK" || !data.results || data.results.length === 0) {
//           return NextResponse.json(
//             { success: false, message: "Could not find address for this location" },
//             { status: 404 }
//           );
//         }
        
//         // Get the most accurate address result
//         const addressResult = data.results[0];
        
//         // Format the address components
//         const formattedAddress = addressResult.formatted_address;
        
//         // Extract city/locality info
//         let city = "Unknown";
//         for (const component of addressResult.address_components) {
//           if (component.types.includes("locality") || component.types.includes("administrative_area_level_2")) {
//             city = component.long_name;
//             break;
//           }
//         }
        
//         return NextResponse.json({
//           success: true,
//           address: {
//             formattedAddress,
//             city,
//             latitude: parseFloat(latitude),
//             longitude: parseFloat(longitude),
//             placeId: addressResult.place_id,
//             components: addressResult.address_components
//           }
//         });
//       } catch (error) {
//         console.error("Error in reverse geocoding:", error);
//         return NextResponse.json(
//           { success: false, message: "Failed to get address from coordinates" },
//           { status: 500 }
//         );
//       }
//     }
    
//     // If no coordinates provided, return current user location data
//     const user = await prisma.user.findUnique({
//       where: { id: session.user.id },
//       select: {
//         id: true,
//         locations: {
//           orderBy: { createdAt: 'desc' },
//           take: 1,
//           select: {
//             id: true,
//             latitude: true,
//             longitude: true,
//             address: true,
//             city: true,
//             updatedAt: true
//           }
//         }
//       }
//     });
    
//     if (!user || !user.locations || user.locations.length === 0) {
//       return NextResponse.json(
//         { success: false, message: "No location data found for this user" },
//         { status: 404 }
//       );
//     }
    
//     return NextResponse.json({
//       success: true,
//       location: user.locations[0]
//     });
    
//   } catch (error) {
//     console.error("Error fetching location:", error);
//     return NextResponse.json(
//       { success: false, message: "Failed to retrieve location data" },
//       { status: 500 }
//     );
//   }
// }