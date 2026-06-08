export interface Login {
    accessToken: string
}

export interface RegisterForm {
    email: string,
    username: string,
    fullName: string,
    password: string
}

export interface LoginForm {
    username: string,
    password: string
}