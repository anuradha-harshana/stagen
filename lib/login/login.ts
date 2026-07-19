import { getUsers } from "../users/users";





export async function loginUser(
    email: string,
    password: string
) {

    const users = await getUsers();

    return users.find(
        user => 
            user.email.toLowerCase() === email.toLowerCase() && user.password === password
    );

}