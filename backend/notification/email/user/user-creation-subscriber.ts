import {Subscription} from "encore.dev/pubsub";
import {UserCreationEvent, userCreationTopic} from "./user-creation.topic";

const _ = new Subscription(userCreationTopic, "send-confirmation-email", {
    handler: async (event: UserCreationEvent) => {
        console.log(event);
    }
});