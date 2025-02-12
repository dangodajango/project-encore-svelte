import {api} from "encore.dev/api";
import {userDatabase} from "../database-setup";
import {userCreationTopic} from "../../notification/email/user/user-creation.topic";

export const createUser = api(
    {
        method: "POST",
        path: "/users",
        expose: true,
        auth: false
    },
    async (createUserRequest: CreateUserRequest): Promise<CreateUserResponse> => {
        await insertUserInDatabase(createUserRequest);
        const savedUser = await fetchUserFromDatabase(createUserRequest.firstName, createUserRequest.lastName);
        await publishUserCreationEvent(savedUser.id, createUserRequest.email);
        return {
            id: savedUser.id,
            firstName: savedUser.first_name,
            lastName: savedUser.last_name,
        };
    }
);

interface CreateUserRequest {
    firstName: string;
    lastName: string;
    email: string;
}

interface CreateUserResponse {
    id: number;
    firstName: string;
    lastName: string;
}

async function insertUserInDatabase({firstName, lastName}: CreateUserRequest) {
    await userDatabase.exec`
        INSERT INTO users (first_name, last_name)
        VALUES (${firstName}, ${lastName})
    `;
}

async function fetchUserFromDatabase(firstName: string, lastName: string): Promise<Record<string, any>> {
    const user = await userDatabase.queryRow`
        SELECT *
        FROM users
        WHERE first_name = ${firstName}
          AND last_name = ${lastName}
    `;
    if (!user) {
        return Promise.reject(new Error("User was not create successfully"));
    }
    return user;
}

async function publishUserCreationEvent(userId: number, email: string) {
    await userCreationTopic.publish({
        userId: userId,
        email: email
    });
}