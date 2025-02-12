import {api, APIError, Query} from "encore.dev/api";
import {userDatabase} from "../database-setup";

export const getUserById = api(
    {
        method: "GET",
        path: "/users/:id",
        expose: true,
        auth: false
    },
    ({id}: { id: number }) => {

    }
);

export const getUserDetailsForAuthentication = api(
    {
        method: "GET",
        path: "/users/authentication",
        expose: true,
        auth: false
    },
    async ({email}: UserDetailsForAuthenticationRequest): Promise<UserDetailsForAuthenticationResponse> => {
        const user = await userDatabase.queryRow`
            SELECT *
            FROM users
            WHERE email = ${email}
        `;
        if (!user) {
            throw APIError.notFound(`User with email ${email} does not exist`);
        }
        return {
            id: user.id,
            email: user.email,
            password: user.password,
        }
    }
);

interface UserDetailsForAuthenticationRequest {
    email: Query<string>;
}

interface UserDetailsForAuthenticationResponse {
    id: number;
    email: string;
    password: string;
}