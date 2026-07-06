import fs from "fs/promises"
import path from "path"


export async function getNavbarItemsToRole(role: string){
    const filePath = path.join(process.cwd(), "data", "navbar.json");

    const fileContent = await fs.readFile(filePath, "utf-8");
    const navbarData = JSON.parse(fileContent);

    return navbarData.find((item: any) => item.role === role)?.items || [];
}