import { defineConfig } from "vitepress";
import { generateSidebar } from "vitepress-sidebar";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Open Library Docs",
  description: "A new docs experience for Open Library",
  base: process.env.NODE_ENV === 'production' ? '/openlibrary-docs/' : '',
  ignoreDeadLinks: true, // 'localhostLinks', // It shouldn't be true but is needed for now to build the site.
  srcExclude: ["_Sidebar.md"], // Ignore the sidebar so we don't get dead link reports
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [{ text: "Home", link: "/" }],
    search: {
      provider: "local",
    },

    sidebar: generateSidebar({
      // scanStartPath: "./docs",
      collapsed: true,
      useFolderLinkFromIndexFile: true,
      excludeFiles: ["_Sidebar.md", "_Footer.md"]
    }),

    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/internetarchive/openlibrary",
      },
    ],
  },
});
