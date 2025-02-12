import {api} from "encore.dev/api";

export const getUser = api(
    {
        method: "GET",
        path: "/users/:id",
        expose: true,
        auth: false
    },
    ({id}: { id: number }) => {

    }
);