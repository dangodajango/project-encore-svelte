import {hashPassword} from "../../authentication/password-hashing.service";
import {userDatabase} from "../database-setup";
import {UserListResponse, UserRegistrationRequest} from "../controller/dto/user.dto";
import {addDefaultRoleToUser, getUserRoles} from "./role.service";
import {publishUserRegistrationEvent} from "./event.service";
import {APIError} from "encore.dev/api";

export async function registerUser(createUserRequest: UserRegistrationRequest) {
    const hashedPassword = await hashPassword(createUserRequest.password);
    const user = await insertUserInDatabase(createUserRequest, hashedPassword);
    await publishUserRegistrationEvent(user.id, user.email);
    return user;
}

async function insertUserInDatabase({firstName, lastName, email}: UserRegistrationRequest, passwordHash: string) {
    await userDatabase.exec`
        INSERT INTO users (first_name, last_name, email, passwordHash)
        VALUES (${firstName}, ${lastName}, ${email}, ${passwordHash})
    `;
    const user = await findUserByEmail(email);
    await addDefaultRoleToUser(user.id);
    return user;
}

export async function findAllUsers(): Promise<UserListResponse> {
    const usersGenerator = userDatabase.query`
        SELECT *
        FROM users;
    `;
    const users = [];
    for await (const user of usersGenerator) {
        users.push({
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            passwordHash: user.passwordhash
        });
    }
    return {
        users: users
    }
}

export async function getUserAuthenticationDetails(email: string) {
    const user = await findUserByEmail(email);
    const roles = await getUserRoles(user.id);
    return {
        user: user,
        roles: roles
    }
}

async function findUserByEmail(email: string) {
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