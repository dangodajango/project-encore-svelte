import {UserRegistrationTopic} from "../../notification/email/user/user-registration.topic";

export async function publishUserRegistrationEvent(userId: string, email: string) {
    await UserRegistrationTopic.publish({
        userId: userId,
        email: email
    });
}