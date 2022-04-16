declare module "*.png" {
  const value: string | undefined;
  export default value;
}

declare module "*.scss" {
  const classes: { [key: string]: string };
  export default classes;
}
