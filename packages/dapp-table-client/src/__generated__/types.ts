import { GraphQLClient } from 'graphql-request';
import { GraphQLClientRequestHeaders } from 'graphql-request/build/cjs/types';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Dapp = {
  __typename?: 'Dapp';
  address: Scalars['String']['output'];
  ceramic: Scalars['String']['output'];
  createdAt: Scalars['Float']['output'];
  defaultFolderName: Scalars['String']['output'];
  deletedAt?: Maybe<Scalars['Float']['output']>;
  deprecated?: Maybe<Scalars['Boolean']['output']>;
  description: Scalars['String']['output'];
  feePoint?: Maybe<Scalars['Int']['output']>;
  id: Scalars['String']['output'];
  logo: Scalars['String']['output'];
  models: Array<Model>;
  name: Scalars['String']['output'];
  updatedAt: Scalars['Float']['output'];
  website: Array<Scalars['String']['output']>;
};

export type DeployDappInput = {
  ceramicUrl?: InputMaybe<Scalars['String']['input']>;
  defaultFolderName: Scalars['String']['input'];
  description: Scalars['String']['input'];
  feePoint?: InputMaybe<Scalars['Int']['input']>;
  logo: Scalars['String']['input'];
  models: Array<InputModel>;
  name: Scalars['String']['input'];
  website: Array<Scalars['String']['input']>;
};

export type InputModel = {
  encryptable: Array<Scalars['String']['input']>;
  feePoint?: InputMaybe<Scalars['Int']['input']>;
  isPublicDomain: Scalars['Boolean']['input'];
  schema: Scalars['String']['input'];
};

export type Message = {
  origin: Scalars['String']['input'];
  signature: Scalars['String']['input'];
};

export type Model = {
  __typename?: 'Model';
  feePoint?: Maybe<Scalars['Int']['output']>;
  internal: Scalars['Boolean']['output'];
  modelName: Scalars['String']['output'];
  streams: Array<ModelStream>;
};

export type ModelStream = {
  __typename?: 'ModelStream';
  createdAt: Scalars['Float']['output'];
  encryptable: Array<Scalars['String']['output']>;
  isPublicDomain: Scalars['Boolean']['output'];
  latest: Scalars['Boolean']['output'];
  modelId: Scalars['String']['output'];
  schema: Scalars['String']['output'];
  version: Scalars['Int']['output'];
};

export type RootMutation = {
  __typename?: 'RootMutation';
  deployDapp: Dapp;
};


export type RootMutationDeployDappArgs = {
  id?: InputMaybe<Scalars['String']['input']>;
  input: DeployDappInput;
  message: Message;
};

export type RootQuery = {
  __typename?: 'RootQuery';
  getDapp: Dapp;
  getDapps: Array<Dapp>;
  getFileSystemModels: Array<Scalars['String']['output']>;
};


export type RootQueryGetDappArgs = {
  id?: InputMaybe<Scalars['String']['input']>;
  modelId?: InputMaybe<Scalars['String']['input']>;
};


export type RootQueryGetDappsArgs = {
  address?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type _Service = {
  __typename?: '_Service';
  sdl: Scalars['String']['output'];
};

export type CreateDappMutationVariables = Exact<{
  input: DeployDappInput;
  message: Message;
}>;


export type CreateDappMutation = { __typename?: 'RootMutation', deployDapp: { __typename?: 'Dapp', id: string, createdAt: number, updatedAt: number, deletedAt?: number | null, name: string, logo: string, website: Array<string>, defaultFolderName: string, description: string, feePoint?: number | null, address: string, ceramic: string, models: Array<{ __typename?: 'Model', modelName: string, internal: boolean, feePoint?: number | null, streams: Array<{ __typename?: 'ModelStream', modelId: string, createdAt: number, schema: string, isPublicDomain: boolean, encryptable: Array<string>, version: number, latest: boolean }> }> } };

export type UpdateDappMutationVariables = Exact<{
  input: DeployDappInput;
  message: Message;
  dappId: Scalars['String']['input'];
}>;


export type UpdateDappMutation = { __typename?: 'RootMutation', deployDapp: { __typename?: 'Dapp', id: string, createdAt: number, updatedAt: number, deletedAt?: number | null, name: string, logo: string, website: Array<string>, defaultFolderName: string, description: string, feePoint?: number | null, address: string, ceramic: string, models: Array<{ __typename?: 'Model', modelName: string, internal: boolean, feePoint?: number | null, streams: Array<{ __typename?: 'ModelStream', modelId: string, createdAt: number, schema: string, isPublicDomain: boolean, encryptable: Array<string>, version: number, latest: boolean }> }> } };

export type GetFileSystemModelsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetFileSystemModelsQuery = { __typename?: 'RootQuery', getFileSystemModels: Array<string> };

export type GetDappsQueryVariables = Exact<{
  address?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetDappsQuery = { __typename?: 'RootQuery', getDapps: Array<{ __typename?: 'Dapp', id: string, createdAt: number, updatedAt: number, deletedAt?: number | null, name: string, logo: string, website: Array<string>, defaultFolderName: string, description: string, feePoint?: number | null, address: string, ceramic: string, models: Array<{ __typename?: 'Model', modelName: string, internal: boolean, feePoint?: number | null, streams: Array<{ __typename?: 'ModelStream', modelId: string, createdAt: number, schema: string, isPublicDomain: boolean, encryptable: Array<string>, version: number, latest: boolean }> }> }> };

export type GetDappQueryVariables = Exact<{
  dappId: Scalars['String']['input'];
}>;


export type GetDappQuery = { __typename?: 'RootQuery', getDapp: { __typename?: 'Dapp', id: string, createdAt: number, updatedAt: number, deletedAt?: number | null, name: string, logo: string, website: Array<string>, defaultFolderName: string, description: string, feePoint?: number | null, address: string, ceramic: string, models: Array<{ __typename?: 'Model', modelName: string, internal: boolean, feePoint?: number | null, streams: Array<{ __typename?: 'ModelStream', modelId: string, createdAt: number, schema: string, isPublicDomain: boolean, encryptable: Array<string>, version: number, latest: boolean }> }> } };


export const CreateDappDocument = gql`
    mutation CreateDapp($input: DeployDappInput!, $message: Message!) {
  deployDapp(input: $input, message: $message) {
    id
    createdAt
    updatedAt
    deletedAt
    name
    logo
    website
    defaultFolderName
    description
    feePoint
    models {
      modelName
      internal
      feePoint
      streams {
        modelId
        createdAt
        schema
        isPublicDomain
        encryptable
        version
        latest
      }
    }
    address
    ceramic
  }
}
    `;
export const UpdateDappDocument = gql`
    mutation UpdateDapp($input: DeployDappInput!, $message: Message!, $dappId: String!) {
  deployDapp(input: $input, message: $message, id: $dappId) {
    id
    createdAt
    updatedAt
    deletedAt
    name
    logo
    website
    defaultFolderName
    description
    feePoint
    models {
      modelName
      internal
      feePoint
      streams {
        modelId
        createdAt
        schema
        isPublicDomain
        encryptable
        version
        latest
      }
    }
    address
    ceramic
  }
}
    `;
export const GetFileSystemModelsDocument = gql`
    query GetFileSystemModels {
  getFileSystemModels
}
    `;
export const GetDappsDocument = gql`
    query GetDapps($address: String, $limit: Int, $offset: Int) {
  getDapps(address: $address, limit: $limit, offset: $offset) {
    id
    createdAt
    updatedAt
    deletedAt
    name
    logo
    website
    defaultFolderName
    description
    feePoint
    models {
      modelName
      internal
      feePoint
      streams {
        modelId
        createdAt
        schema
        isPublicDomain
        encryptable
        version
        latest
      }
    }
    address
    ceramic
  }
}
    `;
export const GetDappDocument = gql`
    query GetDapp($dappId: String!) {
  getDapp(id: $dappId) {
    id
    createdAt
    updatedAt
    deletedAt
    name
    logo
    website
    defaultFolderName
    description
    feePoint
    models {
      modelName
      internal
      feePoint
      streams {
        modelId
        createdAt
        schema
        isPublicDomain
        encryptable
        version
        latest
      }
    }
    address
    ceramic
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    CreateDapp(variables: CreateDappMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<CreateDappMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateDappMutation>(CreateDappDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'CreateDapp', 'mutation');
    },
    UpdateDapp(variables: UpdateDappMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<UpdateDappMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateDappMutation>(UpdateDappDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'UpdateDapp', 'mutation');
    },
    GetFileSystemModels(variables?: GetFileSystemModelsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetFileSystemModelsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetFileSystemModelsQuery>(GetFileSystemModelsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetFileSystemModels', 'query');
    },
    GetDapps(variables?: GetDappsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetDappsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetDappsQuery>(GetDappsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetDapps', 'query');
    },
    GetDapp(variables: GetDappQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetDappQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetDappQuery>(GetDappDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetDapp', 'query');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;