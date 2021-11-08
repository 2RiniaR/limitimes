import { User, UsersRepository } from "src/server/models/user";
import { firestore } from "firebase-admin";
import CollectionReference = firestore.CollectionReference;
import { db } from "src/server/firebase";
import FieldValue = firestore.FieldValue;

type UserDocument = {
  readonly followingUsersId: Set<string>;
  readonly followerUsersId: Set<string>;
};

export class FirestoreRepository implements UsersRepository {
  private readonly users: CollectionReference = db.collection("users");

  private async getUserDocument(id: string): Promise<UserDocument | null> {
    const doc = await this.users.doc(id).get();
    const data = doc.data();
    if (!doc.exists || !data) return null;
    if (!(data["followingUsersId"] instanceof Array) || !(data["followerUsersId"] instanceof Array)) throw Error();
    return {
      followingUsersId: new Set<string>(data["followingUsersId"]),
      followerUsersId: new Set<string>(data["followerUsersId"])
    };
  }

  public async isExist(user: User | string): Promise<boolean> {
    const targetId = user instanceof User ? user.id : user;
    const doc = await this.users.doc(targetId).get();
    return doc.exists;
  }

  private async register(src: User) {
    await this.users.doc(src.id).set(
      {
        followingUsersId: [],
        followerUsersId: []
      },
      { merge: true }
    );
  }

  private async pushFollowingUsers(src: User) {
    if (!src.followingUsers) return;
    const followingUsersId = src.followingUsers.map((user) => user.id);

    const batch = db.batch();
    batch.update(this.users.doc(src.id), {
      followingUsersId: followingUsersId
    });
    followingUsersId.forEach((userId) =>
      batch.update(this.users.doc(userId), {
        followerUsersId: FieldValue.arrayUnion(src.id)
      })
    );
    await batch.commit();
  }

  private async pushFollowerUsers(src: User) {
    if (!src.followerUsers) return;
    const followerUsersId = src.followerUsers.map((user) => user.id);

    const batch = db.batch();
    batch.update(this.users.doc(src.id), {
      followerUsersId: followerUsersId
    });
    followerUsersId.forEach((userId) =>
      batch.update(this.users.doc(userId), {
        followingUsersId: FieldValue.arrayUnion(src.id)
      })
    );
    await batch.commit();
  }

  public async push(src: User) {
    await this.register(src);
    await this.pushFollowingUsers(src);
    await this.pushFollowerUsers(src);
  }

  public async pull(dist: User) {
    const src = await this.getUserDocument(dist.id);
    if (!src) return;
    Object.assign(dist, {
      _followingUsers: Array.from(src.followingUsersId).map((id) => new User(id)),
      _followerUsers: Array.from(src.followerUsersId).map((id) => new User(id))
    });
  }
}
