export interface AuthenticationRequest {
    email: string;
    password: string;
}

export interface AuthenticationResponse {
    jwt: string;
}