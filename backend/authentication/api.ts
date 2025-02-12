import {api, APIError} from "encore.dev/api";
import {user} from "~encore/clients"

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
            jwtToken: "very secure"
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

function buildJWTToken() {

}
