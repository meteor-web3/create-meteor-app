import { GraphQLClient } from "graphql-request";
import { Dapp, DeployDappInput, Message, getSdk } from "./__generated__/types";

const DAPP_TABLE_ENDPOINT =
  process.env.DAPP_TABLE_ENDPOINT ||
  "https://gateway.dataverse.art/v1/dapp-table";

export const client = new GraphQLClient(`${DAPP_TABLE_ENDPOINT}/graphql`);

export async function getFileSystemModels(): Promise<Array<string>> {
  try {
    const res = await getSdk(client).GetFileSystemModels();
    return res.getFileSystemModels;
  } catch (error: any) {
    throw error?.response?.errors?.[0] ?? error;
  }
}

export async function getDapp(dappId: string): Promise<Dapp> {
  try {
    const res = await getSdk(client).GetDapp({ dappId });
    return res.getDapp;
  } catch (error: any) {
    throw error?.response?.errors?.[0] ?? error;
  }
}

export async function getDapps(params?: {
  pubKey?: string;
  limit?: number;
  offset?: number;
}): Promise<Array<Dapp>> {
  try {
    const res = await getSdk(client).GetDapps(params);
    return res.getDapps;
  } catch (error: any) {
    throw error?.response?.errors?.[0] ?? error;
  }
}

export async function createDapp(params: {
  input: DeployDappInput;
  message: Message;
}): Promise<Dapp> {
  try {
    const res = await getSdk(client).CreateDapp(params);
    return res.deployDapp;
  } catch (error: any) {
    throw error?.response?.errors?.[0] ?? error;
  }
}

export async function updateDapp(params: {
  dappId: string;
  input: DeployDappInput;
  message: Message;
}): Promise<Dapp> {
  try {
    const res = await getSdk(client).UpdateDapp(params);
    return res.deployDapp;
  } catch (error: any) {
    throw error?.response?.errors?.[0] ?? error;
  }
}
