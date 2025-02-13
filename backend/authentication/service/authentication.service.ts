import {user} from "~encore/clients";
import {comparePasswords} from "../password-hashing.service";
import {APIError} from "encore.dev/api";
import {getPrivateKey} from "../rsa-key-manager";
import {UserAuthenticationDetailsResponse} from "../../user/controller/dto/user.dto";
import jwt from "jsonwebtoken";

export async function authenticateUser(email: string, password: string): Promise<string> {
    const userDetails = await user.userAuthenticationDetailsEndpoint({email});
    await checkIfPasswordsAreMatching(password, userDetails.passwordHash);
    return buildJWTToken(userDetails);
}

async function checkIfPasswordsAreMatching(actualPassword: string, expectedPassword: string) {
    const result = await comparePasswords(actualPassword, expectedPassword);
    if (result) {
        return;
    }
    throw APIError.unauthenticated("Invalid credentials");
}

function buildJWTToken({id, email, roles}: UserAuthenticationDetailsResponse) {
    const privateKey = getPrivateKey();
    const payload = {
        subject: id,
        email: email,
        roles: roles,
    }
    return jwt.sign(payload, privateKey, {
            algorithm: "RS256",
            expiresIn: "2h",
        }
    )
}