import {api} from "encore.dev/api";
import {AuthenticationRequest, AuthenticationResponse} from "./dto/authentication.dto";
import {authenticateUser} from "../service/authentication.service";

export const authenticate = api(
    {
        method: "POST",
        path: "/authentication",
        expose: true,
        auth: false,
    },
    async ({email, password}: AuthenticationRequest): Promise<AuthenticationResponse> => {
        const jwt = await authenticateUser(email, password);
        return {
            jwt: jwt
        };
    }
);

