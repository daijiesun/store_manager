import { BaseConfig } from '@/types/config';
import { POST, GET, DELETE, PATCH } from './index';

export const saveBaseConfig =(p:BaseConfig)=>{
  return PATCH<boolean>('/config/base',p)
}

export const getBaseConfig =()=>{
  return GET<BaseConfig>('/config/base')
}