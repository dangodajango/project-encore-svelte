import {api} from "encore.dev/api";

export const deleteUser = api(
    {
        method: "DELETE",
        path: "/users/:id",
        expose: true,
        auth: false
    },
    ({id}: { id: number }) => {

    }
);
