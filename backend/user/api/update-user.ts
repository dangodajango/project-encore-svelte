import {api} from "encore.dev/api";

export const updateUser = api(
    {
        method: "PUT",
        path: "/users/:id",
        expose: true,
        auth: false
    },
    ({id}: { id: number }) => {

    }
);