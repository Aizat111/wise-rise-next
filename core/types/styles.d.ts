// Allow importing global styles in TS (Next supports this at runtime)

declare module '*.scss' {
  const content: string;
  export default content;
}

declare module '*.css' {
  const content: string;
  export default content;
}
