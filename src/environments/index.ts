import dotenv from 'dotenv';

dotenv.config();

export const PROJECT_NAME = process.env.PROJECT_NAME;

export const MSSQL_DATABASE = process.env.MSSQL_DATABASE;
export const MSSQL_USER = process.env.MSSQL_USER;
export const MSSQL_PASSWORD = process.env.MSSQL_PASSWORD;
export const MSSQL_PORT = process.env.MSSQL_PORT;
export const MSSQL_HOST = process.env.MSSQL_HOST;
export const MSSQL_DRIVER = process.env.MSSQL_DRIVER;

export const NEO4J_DATABASE = process.env.NEO4J_DATABASE;
export const NEO4J_USER = process.env.NEO4J_USER;
export const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD;
export const NEO4J_PORT = process.env.NEO4J_PORT;
export const NEO4J_HOST = process.env.NEO4J_HOST;
export const NEO4J_DRIVER = process.env.NEO4J_DRIVER;



