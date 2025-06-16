export function getCookieValue(name:any) {
   const token = localStorage.getItem(name);
    if (token) {
        return token;
    }
    return null;
}

