// we don't need any JS on this page, though we'll load
// it in dev so that we get hot module replacement
export const ssr = true;

// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
export const prerender = false;
