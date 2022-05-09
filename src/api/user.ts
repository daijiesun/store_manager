import { POST, GET, DELETE, PATCH } from './index';

interface LoginResponse {
  username: string;
  phoneNum: string;
  token: string;
}
export const postLogin = (p: { username: string, password: string }) => {
  return POST<LoginResponse>('/auth/login', p)
}

export const postLogout = () => {
  return POST('/auth/logout')
}