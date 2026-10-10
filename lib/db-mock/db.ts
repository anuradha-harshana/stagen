import fs from "fs/promises"
import path from "path"


export async function getNavbarItemsToRole(role: string){
    const filePath = path.join(process.cwd(), "data", "navbar", "navbar.json");

    let navbarData = [] as any[];

    try {
      const fileContent = await fs.readFile(filePath, "utf-8");
      navbarData = JSON.parse(fileContent);
    } catch (error) {
      console.error("Failed to load navbar data", error);
      return [];
    }

    return navbarData.find((item: any) => item.role === role)?.items || [];
}