declare module '*.png' {
  const value: string | undefined;
  export default value;
}

declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

/* webpack.DefinePlugin: */
declare const __DEV__: boolean;
declare const __APP_INSIGHTS__: string;
