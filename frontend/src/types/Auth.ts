export interface JwtResponse {
  accessToken: string;
}

export interface RegisterForm {
  email: string;
  username: string;
  fullName: string;
  password: string;
}

export interface LoginForm {
  email: string;
  password: string;
}
