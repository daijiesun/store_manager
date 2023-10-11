import { Dict, PageRequest, PageResponse } from '@/types/common';
import { User } from '@/types/user';
import { POST, GET, DELETE, PATCH } from './index';

interface LoginResponse {
  username: string;
  phoneNum: string;
  token: string;
}
interface LoginRequest {
  username: string;
  password: string;
  imageCode: string;
}
export const postLogin = (p: LoginRequest) => {
  return POST<LoginResponse>('/auth/login', p)
}
export const postRegister = (p: LoginRequest) => {
  return POST<LoginResponse>('/auth/register', p)
}
export const postLogout = () => {
  return POST('/auth/logout')
}
export const roleList = ()=>{
  return GET<Array<Dict>>('/auth/roles')
}
export const userList = (data: PageRequest<any>) => {
  return POST<PageResponse<Array<User>>>('/users/list', data)
}

export const creatUser = (data:any) => {
  return POST('/users/create', data)
}
export const updateUser = (data:any) =>{
  return PATCH('/users/update', data)
}
export const deleteUser = (id: string) => {
  return DELETE(`/users/${id}`)
}

export const batchDeleteUser = (ids: string) => {
  return DELETE(`/users?ids=${ids}`)
}
// 获取验证码
export const getImageCode = () => {
  return GET<string>('/auth/imageCode')
}