import { useApi as nextUseAPi } from "next-basics";
import * as reactQuery from "@tanstack/react-query";

export function useApi() {
  const { get, post, put, del } = nextUseAPi({}, process.env.basePath);

  return { get, post, put, del, ...reactQuery };
}
export default useApi;
