import {userDatabase} from "../database-setup";
import {APIError} from "encore.dev/api";

export async function retrieveUserByEmail(email: string) {
    const user = await userDatabase.queryRow`
        SELECT *
        FROM users
        WHERE email = ${email}
    `;
    if (!user) {
        throw APIError.notFound(`Could not find user with email ${email}`);
    }
    return user;
}