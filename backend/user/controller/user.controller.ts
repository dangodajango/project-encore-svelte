import {api} from "encore.dev/api";
import {
    UserAuthenticationDetailsRequest,
    UserAuthenticationDetailsResponse,
    UserListResponse,
    UserRegistrationRequest,
    UserRegistrationResponse
} from "./dto/user.dto";
import {findAllUsers, getUserAuthenticationDetails, registerUser} from "../service/user.service";

export const userRegistrationEndpoint = api(
    {
        method: "POST",
        path: "/users",
        expose: true,
        auth: false
    },
    async (userRegistrationRequest: UserRegistrationRequest): Promise<UserRegistrationResponse> => {
        const user = await registerUser(userRegistrationRequest);
        return {
            id: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email,
        };
    }
);

export const userListEndpoint = api(
    {
        method: "GET",
        path: "/users",
        expose: false,
        auth: false
    },
    async (): Promise<UserListResponse> => {
        return await findAllUsers();
    }
);

export const userAuthenticationDetailsEndpoint = api(
    {
        method: "GET",
        path: "/users/authentication",
        expose: true,
        auth: false
    },
    async ({email}: UserAuthenticationDetailsRequest): Promise<UserAuthenticationDetailsResponse> => {
        const {user, roles} = await getUserAuthenticationDetails(email);
        return {
            id: user.id,
            email: user.email,
            passwordHash: user.passwordhash,
            roles: roles
        }
    }
);