import bcrypt from "bcrypt";

export async function hashPassword(password: string): Promise<string> {
    try {
        return await bcrypt.hash(password, 12);
    } catch (error) {
        console.error("Could not hash the password", error);
        throw new Error("Could not hash the password");
    }
}