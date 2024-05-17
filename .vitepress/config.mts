import { defineConfig } from "vitepress";
import { generateSidebar } from "vitepress-sidebar";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Open Library Docs",
  description: "A new docs experience for Open Library",
  ignoreDeadLinks: 'localhostLinks',
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
    }),

    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/internetarchive/openlibrary",
      },
    ],

    editLink: {
      pattern: 'https://github.com/internetarchive/openlibrary/wiki/:path'
    }

  },
});
