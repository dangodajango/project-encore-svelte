import {api, APIError} from "encore.dev/api";
import {userDatabase} from "../database-setup";
import {userCreationTopic} from "../../notification/email/user/user-creation.topic";
import bcrypt from "bcrypt";
import {retrieveUserByEmail} from "./repeated-sql-functions";

export const createUser = api(
    {
        method: "POST",
        path: "/users",
        expose: true,
        auth: false
    },
    async (createUserRequest: CreateUserRequest): Promise<CreateUserResponse> => {
        const hashedPassword = await hashPassword(createUserRequest.password);
        const userFromDatabase = await insertUserInDatabase(createUserRequest, hashedPassword);
        await publishUserCreationEvent(userFromDatabase.id, createUserRequest.email);
        return {
            id: userFromDatabase.id,
            firstName: userFromDatabase.first_name,
            lastName: userFromDatabase.last_name,
            email: userFromDatabase.email,
        };
    }
);

interface CreateUserRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

interface CreateUserResponse {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
}

async function hashPassword(password: string): Promise<string> {
    try {
        return await bcrypt.hash(password, 12);
    } catch (error) {
        console.error("Could not hash the password");
        throw APIError.internal("Could not hash the password");
    }
}

async function insertUserInDatabase({firstName, lastName, email}: CreateUserRequest, passwordHash: string) {
    await userDatabase.exec`
        INSERT INTO users (first_name, last_name, email, passwordHash)
        VALUES (${firstName}, ${lastName}, ${email}, ${passwordHash})
    `;

    const user = await retrieveUserByEmail(email);
    const roleId = await retrieveDefaultUserRoleId();

    await userDatabase.exec`
        INSERT INTO user_roles (user_id, role_id)
        VALUES (${user.id}, ${roleId})
    `
    return user;
}

let roleId: string;

async function retrieveDefaultUserRoleId() {
    if (roleId) {
        return roleId;
    }
    const role = await userDatabase.queryRow`
        SELECT *
        FROM roles
        WHERE role = USER
    `;
    if (!role) {
        throw new Error("Could not find default user role");
    }
    roleId = role.id;
    return roleId;
}

async function publishUserCreationEvent(userId: number, email: string) {
    await userCreationTopic.publish({
        userId: userId,
        email: email
    });
}