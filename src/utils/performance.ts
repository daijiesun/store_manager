export const debounce = (() => {
  let timer: any = undefined;
  return (cb: Function, delay: number = 500) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      cb()
    }, delay)
  }
})()