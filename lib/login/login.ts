import { getUsers } from "../users/users";





export async function loginUser(
    email: string,
    password: string
) {

    const users = await getUsers();

    return users.find(
        user => 
            user.status !== "Suspended" && user.status !== "Pending" && !!user.password && user.email.toLowerCase() === email.trim().toLowerCase() && user.password === password
    );

}