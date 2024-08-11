import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export const MasterOpAssembliesTableName = `MasterOpAssemblies`
export const ProductionPlanDetailsTableName = `ProductionPlanDetails`
export const ProductionPlanHeadersTableName = `ProductionPlanHeaders`
export const ItemRequestsTableName = `ItemRequests`
export const ProductionActualsTableName = `ProductionActuals`


export default pool;
