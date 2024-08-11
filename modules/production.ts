// production.js

import pool, { ProductionActualsTableName, ProductionPlanDetailsTableName, ProductionPlanHeadersTableName } from "../config/db";

var production_plan_detail_object: {"id":number}
var production_plan_header_object: number[] = [];

export async function getProductionPlanDetail(): Promise<number|null> {
    try {
        const query = `
            SELECT 
                ppd.id
            FROM 
                "${ProductionPlanDetailsTableName}" ppd
            JOIN 
                "${ProductionPlanHeadersTableName}" pph 
            ON 
                ppd.header_id = pph.id
            WHERE 
                pph.start_time BETWEEN date_trunc('day', now()) AND (date_trunc('day', now()) + interval '1 day - 1 microsecond')
            AND 
            (
                SELECT 
                    COUNT(id) 
                FROM 
                    "${ProductionActualsTableName}" pa 
                WHERE 
                    pa.production_plan_detail_id = ppd.id
            ) < ppd.production_qty
            ORDER BY 
                pph.start_time ASC, ppd."order" ASC
            LIMIT 1;
        `;

        const result = await pool.query(query);

        if (result.rows.length > 0) {
            production_plan_detail_object = result.rows[0];
            return production_plan_detail_object.id;
        } else {
            console.log("No production plan details found.");
            return null;
        }
    } catch (err) {
        console.error("Error executing query:", err);
        throw err;
    }
}

export async function setProductionActual(production_plan_detail_id: number, recorded_time: Date) {
    try {
        const query = `
            INSERT INTO "${ProductionActualsTableName}" (production_plan_detail_id, recorded_time, created_at) 
            VALUES ($1, $2, now())
            RETURNING *;
        `;
  
        const values = [production_plan_detail_id, recorded_time];
  
        const result = await pool.query(query, values);
  
        if (result.rows.length > 0) {
            const insertedRecord = result.rows[0];
            // console.log("Inserted ProductionActual:", insertedRecord);
            return insertedRecord;
        } else {
            console.log("Failed to insert production actual.");
            return null;
        }
    } catch (err) {
        console.error("Error inserting production actual:", err);
        throw err;
    }
}

export async function getProductionPlanDetailsFromHeader(): Promise<number[] | null> {
    try {
        const query = `
            SELECT 
                ppd.id
            FROM 
                "${ProductionPlanDetailsTableName}" ppd
            JOIN 
                "${ProductionPlanHeadersTableName}" pph 
            ON 
                ppd.header_id = pph.id
            WHERE 
                now() BETWEEN pph.start_time AND pph.end_time;
        `;

        const result = await pool.query(query);

        if (result.rows.length > 0) {
            production_plan_header_object = result.rows.map(row => row.id);
            return production_plan_header_object;
        } else {
            console.log("No production plan headers found.");
            return null;
        }
    } catch (err) {
        console.error("Error executing query:", err);
        throw err;
    }
}
