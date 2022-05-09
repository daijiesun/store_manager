
export const getFileName = (url: string) => {
  if (!url) {
    return new Date().getTime().toString()
  }
  const list = url.split('/');

  return list[list.length - 1];
}