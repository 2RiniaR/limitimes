import { UsersRepository } from "src/server/models/user";
import { FirestoreRepository } from "./firestore";

export const repository: UsersRepository = new FirestoreRepository();
