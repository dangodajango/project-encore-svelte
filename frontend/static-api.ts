import {api} from "encore.dev/api";

export const staticResources = api.static(
    {
        expose: true,
        path: "/frontend/*path",
        dir: "./dist",
        auth: false
    },
);