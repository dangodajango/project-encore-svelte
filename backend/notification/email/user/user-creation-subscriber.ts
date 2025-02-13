import {Subscription} from "encore.dev/pubsub";
import {UserRegistrationEvent, UserRegistrationTopic} from "./user-registration.topic";

const _ = new Subscription(UserRegistrationTopic, "send-confirmation-email", {
    handler: async (event: UserRegistrationEvent) => {
        console.log(event);
    }
});