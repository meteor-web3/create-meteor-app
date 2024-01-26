export enum Operation {
  Create,
  Update,
}

export interface Model {
  isPublicDomain: boolean;
  schema: string;
  encryptable: string[];
}

export interface CreateDappProps {
  input: {
    name: string;
    defaultFolderName: string;
    description: string;
    website: string[];
    logo: string;
    models: Model[];
    ceramicUrl: string | null;
  };
  message: {
    origin: string;
    signature: string;
  };
}

export interface UpdateDappProps extends CreateDappProps {
  dappId: string;
}
