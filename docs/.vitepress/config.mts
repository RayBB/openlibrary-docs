import { defineConfig } from "vitepress";
import { generateSidebar } from "vitepress-sidebar";
import { withPwa } from '@vite-pwa/vitepress'

// https://vitepress.dev/reference/site-config
export default withPwa(defineConfig({
  title: "Beta Open Library Docs",
  description: "One web page for every book ever published",
  base: process.env.NODE_ENV === 'production' ? '/openlibrary-docs/' : '',
  ignoreDeadLinks: true, // TODO: Fix links!
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [{ text: "Home", link: "/" }],

    search: {
      provider: "local",
    },

    sidebar: generateSidebar({
      scanStartPath: "./docs",
      collapsed: true,
      useFolderLinkFromIndexFile: true,
    }),
    socialLinks: [
      { icon: "github", link: "https://github.com/internetarchive/openlibrary" },
    ],

    editLink: {
      pattern: 'https://github.com/RayBB/openlibrary-docs/tree/main/docs/:path'
    }
  },
}));
