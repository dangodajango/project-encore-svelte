export interface RoleCreationResponse {
    roleId: string;
}

export interface RoleModificationRequest {
    id: number;
    role: string;
}

export interface RoleModificationResponse {
    id: string;
    role: string;
}

export interface RolesListResponse {
    roles: {
        id: string;
        role: string;
    }[];
}