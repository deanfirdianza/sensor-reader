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

export function getAssemblyNameFromSensorKey(key: string): string {
    const assemblyMap: { [key: string]: string } = {
        'REG002': 'OP 1',
        'REG003': 'SUB ASSY CRANKSHAFT',
        'REG004': 'OP 2',
        'REG005': 'SUB ASSY BALANCER',
        'REG006': 'OP 3/1',
        'REG007': 'SUB ASSY RADIATOR',
        'REG008': 'OP 3/2',
        'REG009': 'SUB ASSY CAMSHAFT',
        'REG010': 'OP 4',
        'REG011': 'SUB ASSY PISTON',
        'REG012': 'OP 5/1',
        'REG013': 'SUB ASSY CYL HEAD',
        'REG014': 'OP 5/2',
        'REG015': 'SUB ASSY CAP FO TANK',
        'REG016': 'OP 6',
        'REG017': 'SUB ASSY GEARCASE',
        'REG018': 'OP 7',
        'REG019': 'SUB ASSY ROCK ARM',
        'REG020': 'OP 8',
        'REG021': 'SUB ASSY STAY RADIATOR',
        'REG022': 'OP 9',
        'REG023': 'SUB ASSY AIR CLEANER',
        'REG024': 'OP 10',
        'REG025': 'SUB ASSY CAP FO TANK',
        'REG026': 'OP 11',
        'REG027': 'SUB ASSY FLYWHEEL',
    };

    return assemblyMap[key] || 'Unknown Key';
}
