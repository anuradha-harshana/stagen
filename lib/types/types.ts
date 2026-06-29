export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
}

export interface Login {
    user: User;
}

export interface Register {
    user: User;
    role: string;
}

export interface Company {
    companyUser: User;
    tenant_id: string;
}

export interface Trade {
    tradeUser: User;
}

export interface Customer {
    customerUser: User;
}