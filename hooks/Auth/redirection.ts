export function getRedirectPath(role: string) {
    switch (role) {
        case "company":
            return "/company-admin";

        case "company-management":
            return "/company-management";

        case "customer":
            return "/customer";

        default:
            return "/redirect";
    }
}