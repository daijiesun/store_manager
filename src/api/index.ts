import { SSStorate } from '@/utils/storage';
import axios, { AxiosResponse } from 'axios';
import { ElMessage } from 'element-plus'

axios.interceptors.request.use(function (config) {
  return config;
}, function (error) {
  return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  return Promise.reject(error);
});

axios.defaults.baseURL = import.meta.env.VITE_APP_API;

function FETCH<T>(url: string, method: string, data: any): Promise<T> {
  axios.defaults.headers['Authorization'] = SSStorate.getItem('token')//"AUTH_TOKEN";
  const METHOD: any = (axios as any)[method];
  return new Promise((resolve, reject) => {
    METHOD(url, data).then((res: AxiosResponse) => {
      // console.log(res);
      if (res.data.status === 200 || res.data.status === 201) {
        resolve(res.data.data as T)
      } else if(res.status == 200 && typeof res.data !== 'object') {
        resolve(res.data as T)
      } else {
        if (res.data.message) {
          ElMessage.error(res.data.message)
        }
        reject()
      }
    }).catch((error: any) => {
      // console.log(error)
      if (error?.response?.data?.message) {
        ElMessage.error(JSON.stringify(error.response.data.message))
      } else {
        ElMessage.error(JSON.stringify(error.message))
      }
      reject(error)
    })
  })
}

export function GET<T>(url: string, params: any = undefined): Promise<T> {
  return FETCH(url, 'get', params);
}
export function POST<T>(url: string, params: any = undefined): Promise<T> {
  return FETCH(url, 'post', params);
}
export function DELETE<T>(url: string, params: any = undefined): Promise<T> {
  return FETCH(url, 'delete', params);
}
export function PUT<T>(url: string, params: any = undefined): Promise<T> {
  return FETCH(url, 'put', params);
}
export function PATCH<T>(url: string, params: any = undefined): Promise<T> {
  return FETCH(url, 'patch', params);
}