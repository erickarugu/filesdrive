import { getItem, removeItem, setItem } from "next-basics";
import { AUTH_TOKEN } from "./constants";

export function getClientAuthToken() {
  return getItem(AUTH_TOKEN);
}

export function setClientAuthToken(token: string) {
  return setItem(AUTH_TOKEN, token);
}

export function removeClientAuthToken() {
  return removeItem(AUTH_TOKEN);
}
