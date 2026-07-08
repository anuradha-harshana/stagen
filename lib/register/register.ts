import { User } from "../types/types";
import { generateId, getUsers, saveUsers } from "../users/users";






export async function createUser(
    username: string,
    email: string,
    password: string,
    role: string
) {

    const users = await getUsers();

    const exists = users.some(
        user => user.email.toLowerCase() === email.toLowerCase()
    );

    if(exists){
        throw new Error("Email already exists");
    }

    const newUser: User = {
        id: generateId(),
        username,
        email,
        password,
        role
    }

    users.push(newUser);

    await saveUsers(users);

    return newUser;

}