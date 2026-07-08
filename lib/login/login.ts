import { getUsers } from "../users/users";





export async function loginUser(
    email: string,
    password: String
) {

    const users = await getUsers();

    return users.find(
        user => 
            user.email === email && user.password === password
    );

}