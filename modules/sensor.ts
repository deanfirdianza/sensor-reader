export function checkSensorRegistry(key: string): boolean {
    // Ensure the key starts with "REG" and has a three-digit number
    if (key.startsWith("REG") && key.length === 6) {
        // Extract the numeric part of the key
        const numPart = parseInt(key.substring(3), 10);
        
        // Check if the numeric part is between 1 and 26 (inclusive)
        if (numPart >= 1 && numPart <= 26) {
            return true;
        }
    }
    
    return false;
}
