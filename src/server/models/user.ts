import { UserService } from "src/server/models/user-service";
import { db } from "src/server/firebase";
import { firestore } from "firebase-admin";
import FieldValue = firestore.FieldValue;
import Transaction = firestore.Transaction;

export type UserDocument = {
  readonly followings: string[];
};

export class FollowingSelfError extends Error {}
export class NotFoundError extends Error {}
export class AlreadyFollowedError extends Error {}
export class UnfollowTargetNotFoundError extends Error {}

export class User {
  public readonly service: UserService;
  public readonly id: string;
  public readonly ref;

  constructor(props: Pick<User, "id" | "service">) {
    this.service = props.service;
    this.id = props.id;
    this.ref = this.service.users.doc(this.id);
  }

  public async exists(): Promise<boolean> {
    const doc = await this.ref.get();
    return doc.exists;
  }

  protected async getDocument(): Promise<UserDocument> {
    const doc = await this.ref.get();
    const data = doc.data();
    if (!doc.exists || !data) throw new NotFoundError();
    return data as UserDocument;
  }

  protected async transaction<T>(process: (transaction: Transaction, user: UserDocument) => T): Promise<T> {
    return db.runTransaction(async (transaction) => {
      const doc = await transaction.get(this.ref);
      const data = doc.data();
      if (!doc.exists || !data) throw new NotFoundError();
      return process(transaction, data as UserDocument);
    });
  }

  public isSame(target: User): boolean {
    return this.id === target.id;
  }

  public async follow(target: User) {
    if (this.isSame(target)) throw new FollowingSelfError();
    await this.transaction((transaction, user) => {
      if (user.followings.includes(target.id)) throw new AlreadyFollowedError();
      transaction.update(this.ref, { followings: FieldValue.arrayUnion(target.id) });
    });
  }

  public async unfollow(target: User) {
    await this.transaction((transaction, user) => {
      if (!user.followings.includes(target.id)) throw new UnfollowTargetNotFoundError();
      transaction.update(this.ref, { followings: FieldValue.arrayRemove(target.id) });
    });
  }

  public async getFollowings(): Promise<User[]> {
    const user = await this.getDocument();
    return user.followings.map((userId) => this.service.get(userId));
  }

  public async getFollowers(): Promise<User[]> {
    const snapshot = await this.service.users.where("followings", "array-contains", this.id).get();
    const followers: User[] = [];
    snapshot.forEach((doc) => followers.push(this.service.get(doc.id)));
    return followers;
  }
}
