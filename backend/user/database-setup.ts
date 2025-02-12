import {SQLDatabase} from "encore.dev/storage/sqldb";

export const userDatabase = new SQLDatabase("users", {
    migrations: "./migrations"
});