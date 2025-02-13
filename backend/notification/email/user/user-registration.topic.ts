import {Topic} from "encore.dev/pubsub"

export interface UserRegistrationEvent {
    userId: string;
    email: string;
}

export const UserRegistrationTopic = new Topic<UserRegistrationEvent>("userRegistration", {
    deliveryGuarantee: "at-least-once",
});
