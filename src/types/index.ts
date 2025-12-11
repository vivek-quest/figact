export type FigActConfig = {
  personalAccessToken: string;
  fileKey: string;
  [k: string]: any;
}

export type CLICommonOptions = {
  config?: string;
  personalAccessToken?: string;
  fileKey?: string;
  cache: boolean;
};

export type CLIStylesOptions = {
  type?: string;
  name?: string | string[];
  outDir: string;
  filename: string;
  prefix?: string;
};