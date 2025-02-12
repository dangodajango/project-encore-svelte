import {api, APIError} from "encore.dev/api";
import {user} from "~encore/clients";
import {getPrivateKey} from "./rsa-key-manager";
import {UserDetailsForAuthenticationResponse} from "../user/api/get-user";
import jwt from "jsonwebtoken";

export const authenticate = api(
    {
        method: "POST",
        path: "/authentication",
        expose: true,
        auth: false,
    },
    async ({email, password}: AuthenticationRequest): Promise<AuthenticationResponse> => {
        const userDetails = await user.getUserDetailsForAuthentication({email});
        if (userDetails.password !== password) {
            throw APIError.unauthenticated("Invalid credentials");
        }
        return {
            jwtToken: buildJWTToken(userDetails)
        };
    }
);

interface AuthenticationRequest {
    email: string;
    password: string;
}

interface AuthenticationResponse {
    jwtToken: string;
}

function buildJWTToken({id, email, roles}: UserDetailsForAuthenticationResponse) {
    const privateKey = getPrivateKey();
    const payload = {
        subject: id,
        email: email,
        roles: roles,
    }
    return jwt.sign(payload, privateKey, {
            expiresIn: "2h",
        }
    )
}
