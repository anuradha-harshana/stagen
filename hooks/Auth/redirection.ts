export function getRedirectPath(role: string) {
    switch (role) {
        case "company":
            return "/company";

        case "company-management":
            return "/company-management";

        case "customer":
            return "/customer";

        case "supervisor":
            return "/supervisor";

        default:
            return "/redirect";
    }
}