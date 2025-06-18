import EXIF from 'exif-js';

export interface ImageMetadata {
  // Basic info
  fileName: string;
  fileSize: number;
  fileType: string;
  dimensions?: {
    width: number;
    height: number;
  };
  
  // EXIF data
  timestamp?: Date;
  gpsCoordinates?: {
    latitude: number;
    longitude: number;
    altitude?: number;
  };
  
  // Camera info
  camera?: {
    make?: string;
    model?: string;
    software?: string;
  };
  
  // Photo settings
  settings?: {
    iso?: number;
    aperture?: string;
    shutterSpeed?: string;
    focalLength?: string;
    flash?: boolean;
  };
  
  // Context
  orientation?: number;
  colorSpace?: string;
  originalDateTime?: string;
  digitizedDateTime?: string;
}

export interface FoodImageAnalysis extends ImageMetadata {
  // Nutritional context
  mealContext?: {
    estimatedMealTime?: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
    venueType?: 'home' | 'restaurant' | 'outdoor' | 'unknown';
    socialContext?: 'alone' | 'group' | 'unknown';
  };
  
  // Location context
  locationContext?: {
    country?: string;
    city?: string;
    venue?: string;
    isHome?: boolean;
  };
}

/**
 * Extract comprehensive metadata from an image file
 */
export const extractImageMetadata = (file: File): Promise<ImageMetadata> => {
  return new Promise((resolve, reject) => {
    const metadata: ImageMetadata = {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    };

    // Create image element to get dimensions
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      metadata.dimensions = {
        width: img.naturalWidth,
        height: img.naturalHeight
      };
      
      // Extract EXIF data
      EXIF.getData(file as any, function(this: any) {
        try {
          // Basic EXIF data
          const exifData = EXIF.getAllTags(this);
          console.log('EXIF Data:', exifData);
          
          // Extract timestamp
          const dateTime = EXIF.getTag(this, 'DateTime') || 
                          EXIF.getTag(this, 'DateTimeOriginal') || 
                          EXIF.getTag(this, 'DateTimeDigitized');
          
          if (dateTime) {
            // Parse EXIF date format (YYYY:MM:DD HH:MM:SS)
            const exifDate = dateTime.replace(/^(\d{4}):(\d{2}):(\d{2})/, '$1-$2-$3');
            metadata.timestamp = new Date(exifDate);
            metadata.originalDateTime = dateTime;
          }
          
          // Extract GPS coordinates
          const gpsLat = EXIF.getTag(this, 'GPSLatitude');
          const gpsLon = EXIF.getTag(this, 'GPSLongitude');
          const gpsLatRef = EXIF.getTag(this, 'GPSLatitudeRef');
          const gpsLonRef = EXIF.getTag(this, 'GPSLongitudeRef');
          const gpsAlt = EXIF.getTag(this, 'GPSAltitude');
          
          if (gpsLat && gpsLon) {
            const lat = convertDMSToDD(gpsLat, gpsLatRef);
            const lon = convertDMSToDD(gpsLon, gpsLonRef);
            
            if (lat !== null && lon !== null) {
              metadata.gpsCoordinates = {
                latitude: lat,
                longitude: lon,
                altitude: gpsAlt || undefined
              };
            }
          }
          
          // Camera information
          const make = EXIF.getTag(this, 'Make');
          const model = EXIF.getTag(this, 'Model');
          const software = EXIF.getTag(this, 'Software');
          
          if (make || model || software) {
            metadata.camera = { make, model, software };
          }
          
          // Photo settings
          const iso = EXIF.getTag(this, 'ISOSpeedRatings');
          const aperture = EXIF.getTag(this, 'FNumber');
          const shutterSpeed = EXIF.getTag(this, 'ExposureTime');
          const focalLength = EXIF.getTag(this, 'FocalLength');
          const flash = EXIF.getTag(this, 'Flash');
          
          metadata.settings = {
            iso,
            aperture: aperture ? `f/${aperture}` : undefined,
            shutterSpeed: shutterSpeed ? `1/${Math.round(1/shutterSpeed)}s` : undefined,
            focalLength: focalLength ? `${focalLength}mm` : undefined,
            flash: flash !== undefined ? flash !== 0 : undefined
          };
          
          // Other metadata
          metadata.orientation = EXIF.getTag(this, 'Orientation');
          metadata.colorSpace = EXIF.getTag(this, 'ColorSpace');
          
          URL.revokeObjectURL(url);
          resolve(metadata);
          
        } catch (error) {
          console.error('Error extracting EXIF data:', error);
          URL.revokeObjectURL(url);
          resolve(metadata); // Return basic metadata even if EXIF fails
        }
      });
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    
    img.src = url;
  });
};

/**
 * Convert GPS DMS (Degrees, Minutes, Seconds) to Decimal Degrees
 */
const convertDMSToDD = (dms: number[], ref: string): number | null => {
  if (!dms || dms.length !== 3) return null;
  
  let dd = dms[0] + dms[1]/60 + dms[2]/3600;
  
  if (ref === 'S' || ref === 'W') {
    dd = dd * -1;
  }
  
  return dd;
};

/**
 * Analyze food image for nutritional context
 */
export const analyzeFoodImageContext = async (metadata: ImageMetadata): Promise<FoodImageAnalysis> => {
  const analysis: FoodImageAnalysis = { ...metadata };
  
  // Determine meal time based on timestamp
  if (metadata.timestamp) {
    const hour = metadata.timestamp.getHours();
    
    if (hour >= 5 && hour < 11) {
      analysis.mealContext = { ...analysis.mealContext, estimatedMealTime: 'breakfast' };
    } else if (hour >= 11 && hour < 16) {
      analysis.mealContext = { ...analysis.mealContext, estimatedMealTime: 'lunch' };
    } else if (hour >= 16 && hour < 22) {
      analysis.mealContext = { ...analysis.mealContext, estimatedMealTime: 'dinner' };
    } else {
      analysis.mealContext = { ...analysis.mealContext, estimatedMealTime: 'snacks' };
    }
  }
  
  // Determine venue type based on camera and location
  if (metadata.camera?.make?.toLowerCase().includes('iphone') || 
      metadata.camera?.model?.toLowerCase().includes('iphone')) {
    // iPhone photos are often more casual/personal
    analysis.mealContext = { 
      ...analysis.mealContext, 
      venueType: 'home', // Default assumption for phone photos
      socialContext: 'alone' // Default for personal photos
    };
  }
  
  // Enhanced location context with GPS
  if (metadata.gpsCoordinates) {
    try {
      // Here you could integrate with a reverse geocoding service
      // For now, we'll just mark that location is available
      analysis.locationContext = {
        venue: `${metadata.gpsCoordinates.latitude.toFixed(4)}, ${metadata.gpsCoordinates.longitude.toFixed(4)}`,
        isHome: false // Would need location history to determine
      };
    } catch (error) {
      console.error('Error analyzing location:', error);
    }
  }
  
  return analysis;
};

/**
 * Format metadata for display
 */
export const formatMetadataForDisplay = (metadata: ImageMetadata): string => {
  const parts: string[] = [];
  
  if (metadata.timestamp) {
    parts.push(`📅 **Taken:** ${metadata.timestamp.toLocaleString()}`);
  }
  
  if (metadata.gpsCoordinates) {
    parts.push(`📍 **Location:** ${metadata.gpsCoordinates.latitude.toFixed(4)}, ${metadata.gpsCoordinates.longitude.toFixed(4)}`);
  }
  
  if (metadata.camera) {
    const camera = [metadata.camera.make, metadata.camera.model].filter(Boolean).join(' ');
    if (camera) {
      parts.push(`📱 **Camera:** ${camera}`);
    }
  }
  
  if (metadata.dimensions) {
    parts.push(`📏 **Size:** ${metadata.dimensions.width} × ${metadata.dimensions.height}`);
  }
  
  if (metadata.settings?.iso) {
    parts.push(`📸 **ISO:** ${metadata.settings.iso}`);
  }
  
  return parts.join('\n');
}; 