export function parseJwt(token: string) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

export function useAuth() {
  const token = localStorage.getItem("token");
  if (token) {
    const decoded = parseJwt(token);
    if (decoded.id) {
      return { isLoggedIn: true, userData: decoded, token };
    }
  }
  return {
    isLoggedIn: false,
    userData: {},
    token: null,
  };
}

export function getUserAuth() {
  const token = localStorage.getItem("token");
  console.log('====================================');
  console.log(token);
  console.log('====================================');
  // if (token) {
  //   const decoded = parseJwt(token);
  //   if (decoded.id) {
  //     return { isLoggedIn: true, userData: decoded, token };
  //   }
  // }
  return {
    isLoggedIn: false,
    userData: {},
    token: null,
  };
}

export function deepCopy(data: any) {
  return JSON.parse(JSON.stringify(data));
}
