import {api} from "encore.dev/api"
import {
    RoleCreationResponse,
    RoleModificationRequest,
    RoleModificationResponse,
    RolesListResponse
} from "./dto/role.dto";
import {createRole, deleteRole, listAllRoles, updateRole} from "../service/role.service";

export const roleCreationEndpoint = api(
    {
        method: "POST",
        path: "/roles",
        expose: false,
        auth: false
    },
    async ({role}: { role: string }): Promise<RoleCreationResponse> => {
        const roleId = await createRole(role);
        return {
            roleId: roleId,
        };
    }
);

export const roleModificationEndpoint = api(
    {
        method: "PUT",
        path: "/roles/:id",
        expose: false,
        auth: false
    },
    async ({id, role}: RoleModificationRequest): Promise<RoleModificationResponse> => {
        const updatedRole = await updateRole(id, role);
        return {
            id: updatedRole.id,
            role: updatedRole.role
        };
    }
);

export const roleDeletionEndpoint = api(
    {
        method: "DELETE",
        path: "/roles/:id",
        expose: false,
        auth: false
    },
    async ({id}: { id: string }) => {
        await deleteRole(id);
    }
)

export const rolesListEndpoint = api(
    {
        method: "GET",
        path: "/roles",
        expose: false,
        auth: false
    },
    async (): Promise<RolesListResponse> => {
        return await listAllRoles();
    }
);