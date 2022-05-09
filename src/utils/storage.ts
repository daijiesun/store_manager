

const getKey = (key: string): string => {
  return `${import.meta.env.VITE_APP_NAME}_${key}`;
}

export const LCStorage = {
  setItem(key: string, value: any) {
    const k = getKey(key);
    return localStorage.setItem(k, JSON.stringify(value))
  },
  removeItem(key: string) {
    const k = getKey(key);
    return localStorage.removeItem(k)
  },
  getItem(key: string) {
    const k = getKey(key);
    const value = localStorage.getItem(k);
    return JSON.parse(value as any);
  },
  clear(){
    localStorage.clear()
  }
}

export const SSStorate = {
  setItem(key: string, value: any) {
    const k = getKey(key);
    return sessionStorage.setItem(k, JSON.stringify(value))
  },
  removeItem(key: string) {
    const k = getKey(key);
    return sessionStorage.removeItem(k)
  },
  getItem(key: string) {
    const k = getKey(key);
    const value = sessionStorage.getItem(k);
    return JSON.parse(value as any);
  },
  clear(){
    sessionStorage.clear()
  }
}
