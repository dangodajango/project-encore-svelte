import {Query} from "encore.dev/api";

export interface UserRegistrationRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface UserRegistrationResponse {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
}

export interface UserListResponse {
    users: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        passwordHash: string;
    }[];
}

export interface UserAuthenticationDetailsRequest {
    email: Query<string>;
}

export interface UserAuthenticationDetailsResponse {
    id: number;
    email: string;
    passwordHash: string;
    roles: string[];
}
