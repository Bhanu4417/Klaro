const nextConfig = {
  reactStrictMode: true,
  env: {
    CLERK_DISABLE_AUTO_PROXY: "true",
    NEXT_PUBLIC_CLERK_DISABLE_AUTO_PROXY: "true",
    NEXT_PUBLIC_CLERK_JS_URL: "https://cdn.jsdelivr.net/npm/@clerk/clerk-js@6/dist/clerk.browser.js",
    NEXT_PUBLIC_CLERK_UI_URL: "https://cdn.jsdelivr.net/npm/@clerk/ui@1/dist/ui.browser.js",
  },
};

module.exports = nextConfig;
