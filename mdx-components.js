import mdxComponents from "./components/mdx_components";

export function useMDXComponents(components) {
    return { ...components, ...mdxComponents };
    // Allows customizing built-in components, e.g. to add styling.
    // return {
    //   h1: ({ children }) => <h1 style={{ fontSize: "100px" }}>{children}</h1>,
    //   ...components,
    // }
}
