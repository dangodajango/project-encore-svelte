import bcrypt from "bcrypt";

export async function hashPassword(password: string): Promise<string> {
    try {
        return await bcrypt.hash(password, 12);
    } catch (error) {
        console.error("Could not hash the password", error);
        throw new Error("Could not hash the password");
    }
}

/**
 * @param actualPassword a raw, not hashed string, the {@link bcrypt.compare} function will do the hashing
 * @param expectedPassword the hashed password from the database
 */
export async function comparePasswords(actualPassword: string, expectedPassword: string): Promise<boolean> {
    return await bcrypt.compare(actualPassword, expectedPassword);
}