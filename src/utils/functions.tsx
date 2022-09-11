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
    token: "",
  };
}

export function deepCopy(data: any) {
  return JSON.parse(JSON.stringify(data));
}

const MONTHS_MAP = [
  "Jan",
  "Feb",
  "Mar",
  "April",
  "May",
  "June",
  "July",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

export function toMsgTime(value: string) {
  try {
    const date = new Date(value);
    const m: number = date.getMonth();
    let hrs: number | string = date.getHours();
    const ampm = hrs < 12 ? "AM" : "PM";
    hrs = hrs % 12 || 12;
    hrs = hrs.toString().length > 1 ? hrs : "0" + hrs;
    let mins: number | string = date.getMinutes();
    mins = mins.toString().length > 1 ? mins : "0" + mins;
    return `${MONTHS_MAP[m]} ${value.substring(
      8,
      10
    )}, ${hrs}:${mins} ${ampm} `;
  } catch {
    return value;
  }
}
