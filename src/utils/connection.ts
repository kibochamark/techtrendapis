// import { Pool } from "pg";
import { drizzle } from 'drizzle-orm/neon-http';
// import { Pool } from '@neondatabase/serverless';

// import { drizzle } from 'drizzle-orm/neon-serverless';
import { neon } from '@neondatabase/serverless';
import * as schema from "../db/schema"


// const pool = new Pool({
//     connectionString: process.env.DATABASE_URL,
//     ssl: {
//         rejectUnauthorized: false
//     }
// })
// import { Pool } from '@neondatabase/serverless';

// const pool = new Pool({ connectionString: "postgresql://blog_owner:cvQlHMJK0L2T@ep-cold-dust-a5ex9ahi.us-east-2.aws.neon.tech/blog?sslmode=require" });
// const db = drizzle(pool)

const sql = neon("postgresql://blog_owner:cvQlHMJK0L2T@ep-cold-dust-a5ex9ahi.us-east-2.aws.neon.tech/blog?sslmode=require");
const db = drizzle(sql, {schema:schema});

// const db = drizzle(pool)


export default db




