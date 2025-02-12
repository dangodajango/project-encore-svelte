import {Topic} from "encore.dev/pubsub"

export interface UserCreationEvent {
    userId: number;
    email: string;
}

export const userCreationTopic = new Topic<UserCreationEvent>("userCreation", {
    deliveryGuarantee: "at-least-once",
});
