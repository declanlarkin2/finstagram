export class User {
  id?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
  token?: string;
}

export class UserDetails {
  username: string;
  password: string;
  confirmPassword?: string;
}
