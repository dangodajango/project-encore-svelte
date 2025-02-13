import {userDatabase} from "../database-setup";
import {RolesListResponse} from "../controller/dto/role.dto";

export async function createRole(role: string): Promise<string> {
    await userDatabase.exec`
        INSERT INTO roles (role)
        VALUES (${role})
    `;
    return await getRoleIdByRoleName(role);
}

export async function updateRole(id: number, role: string) {
    await userDatabase.exec`
        UPDATE roles
        SET role = ${role}
        WHERE id = ${id}
    `;
    const updatedRole = await userDatabase.queryRow`
        SELECT *
        FROM roles
        WHERE id = ${id}
    `;
    if (!updatedRole) {
        throw new Error(`Role with id ${id} not found`);
    }
    return updatedRole;
}

export async function deleteRole(id: string) {
    await userDatabase.exec`
        DELETE
        FROM roles
        WHERE id = ${id}
    `;
}

export async function listAllRoles(): Promise<RolesListResponse> {
    const rolesGenerator = userDatabase.query`
        SELECT *
        FROM roles
    `;
    const roles = [];
    for await (const role of rolesGenerator) {
        roles.push({
            id: role.id,
            role: role.role
        });
    }
    return {
        roles: roles
    }
}

export async function addDefaultRoleToUser(userId: string) {
    const roleId = await getDefaultRoleId();
    await userDatabase.exec`
        INSERT INTO user_roles (user_id, role_id)
        VALUES (${userId}, ${roleId})
    `;
}

let defaultRoleId: string;

async function getDefaultRoleId() {
    if (defaultRoleId) {
        return defaultRoleId;
    }
    defaultRoleId = await getRoleIdByRoleName('USER')
    return defaultRoleId;
}

async function getRoleIdByRoleName(roleName: string): Promise<string> {
    const roleId = await userDatabase.queryRow`
        SELECT id
        FROM roles
        WHERE role = ${roleName}
    `;
    if (!roleId) {
        throw new Error(`Could not find role ${roleName}`);
    }
    return roleId.id;
}

export async function getUserRoles(userId: number) {
    const userRoles = userDatabase.query`
        SELECT role
        FROM user_roles u
                 JOIN roles r ON u.role_id = r.id
        WHERE u.user_id = ${userId}
    `
    const roles: string[] = [];
    for await (const role of userRoles) {
        roles.push(role.role);
    }
    return roles;
}