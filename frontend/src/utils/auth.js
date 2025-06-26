// window object because localstorage is undefined in ssr;
export const clearLocalStorageOnLogout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('baseId');
  }
};