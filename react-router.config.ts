import type { Config } from "@react-router/dev/config";
import { getDynamicPaths } from "utils/dynamic-path";

export default {
  // Config options...
  // ssr-false to no-server SSG
  ssr: true,
  prerender: async ({ getStaticPaths }) => {
    const paths = await getStaticPaths();
    const dyn_paths = await getDynamicPaths();

    return ["/", ...paths, ...dyn_paths, "/test/a", "/404"];
  },
} satisfies Config;
