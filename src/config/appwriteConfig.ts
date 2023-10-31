import { Client, Account, Databases } from "appwrite";

export const client = new Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("__Your Project ID__");

export const account = new Account(client);
export const databases = new Databases(client);

export const DATABASE_ID = "__Your Database ID__";
export const COMMUNITY_COLLECTION_ID = "Community Collection ID__";
export const CHAT_COLLECTION_ID = "__Chat Collection Id__";
