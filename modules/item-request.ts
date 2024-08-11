import pool, { ItemRequestsTableName, MasterOpAssembliesTableName } from "../config/db";

interface MasterOpAssembly {
    id: number;
}

export async function setItemRequestFromProductionSensorBatch(production_plan_header_id: number, sensor_name: string) {
    try {
        // Query to get the assembly ID based on the sensor name
        const queryAssembly = `
            SELECT id
            FROM "${MasterOpAssembliesTableName}"
            WHERE assembly_name = $1
            LIMIT 1
        `;

        const assemblyValues = [sensor_name];
        const resultAssembly = await pool.query(queryAssembly, assemblyValues);
        
        if (resultAssembly.rows.length > 0) {
            const masterOpAssembly: MasterOpAssembly = resultAssembly.rows[0];

            // Build the batch insert/update query
            let query = `
                INSERT INTO 
                    "${ItemRequestsTableName}" (production_plan_header_id, op_assembly_id, start_time, end_time)
                VALUES 
                    ($1, $2, NOW(), NULL)
                ON CONFLICT (production_plan_header_id, op_assembly_id)
                DO UPDATE SET end_time = NOW()
            `;

            var queryValues = [production_plan_header_id, masterOpAssembly.id]

            // Execute the batch query
            const result = await pool.query(query, queryValues);
        
            // if (result.rowCount != null) {
            //     if (result.rowCount > 0) {
            //         console.log("Inserted/Updated records:", result.rowCount);
            //     } else {
            //         console.log("No records inserted/updated.");
            //     }
            // } else {
            //     console.log("Failed to insert/update item requests.");
            // }
            if (result.rowCount != null) {
                if (result.rowCount == 0) {
                    console.log("No records inserted/updated.");
                }
            } else {
                console.log("Failed to insert/update item requests.");
            }
        } else {
            console.log("Failed to get master op assembly.");
        }
    } catch (err) {
        console.error("Error inserting item requests:", err);
        throw err;
    }
}
