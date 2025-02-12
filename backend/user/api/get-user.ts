import {api, Query} from "encore.dev/api";
import {retrieveUserByEmail} from "./repeated-sql-functions";
import {userDatabase} from "../database-setup";

export const getUserDetailsForAuthentication = api(
    {
        method: "GET",
        path: "/users/authentication",
        expose: true,
        auth: false
    },
    async ({email}: UserDetailsForAuthenticationRequest): Promise<UserDetailsForAuthenticationResponse> => {
        const user = await retrieveUserByEmail(email);
        const roles = await retrieveUserRoles(user.id);
        return {
            id: user.id,
            email: user.email,
            passwordHash: user.passwordHash,
            roles: roles
        }
    }
);

interface UserDetailsForAuthenticationRequest {
    email: Query<string>;
}

export interface UserDetailsForAuthenticationResponse {
    id: number;
    email: string;
    passwordHash: string;
    roles: string[];
}

async function retrieveUserRoles(userId: string) {
    const userRoles = userDatabase.query`
        SELECT *
        FROM user_roles
        WHERE user_id = ${userId}
    `
    const roles: string[] = [];
    for await (const role of userRoles) {
        roles.push(role.id);
    }
    return roles;
}