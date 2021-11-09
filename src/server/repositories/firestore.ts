import { User, UsersRepository } from "src/server/models/user";
import { firestore } from "firebase-admin";
import CollectionReference = firestore.CollectionReference;
import { db } from "src/server/firebase";

type UserDocument = {
  readonly followings: string[];
};

export class FirestoreRepository implements UsersRepository {
  private readonly users: CollectionReference = db.collection("users");

  private async getUserDocument(id: string): Promise<UserDocument | null> {
    const doc = await this.users.doc(id).get();
    const data = doc.data();
    if (!doc.exists || !data) return null;
    if (!(data["followings"] instanceof Array)) throw Error();
    return {
      followings: data["followingUsersId"] as string[]
    };
  }

  public async exists(user: User | string): Promise<boolean> {
    const targetId = user instanceof User ? user.id : user;
    const doc = await this.users.doc(targetId).get();
    return doc.exists;
  }

  private async register(src: User) {
    await this.users.doc(src.id).set({
      followings: []
    });
  }

  private async pushFollowings(src: User) {
    if (!src.followings) return;
    const followingsId = src.followings.map((user) => user.id);

    const batch = db.batch();
    batch.update(this.users.doc(src.id), {
      followings: followingsId
    });
    await batch.commit();
  }

  public async push(src: User) {
    await this.register(src);
    await this.pushFollowings(src);
  }

  public async pull(dist: User) {
    const src = await this.getUserDocument(dist.id);
    if (!src) return;
    Object.assign(dist, {
      _followings: Array.from(src.followings).map((id) => new User(id))
    });
  }

  public async getFollowers(user: User): Promise<User[]> {
    const snapshot = await this.users.where("followings", "array-contains", user.id).get();
    const followers: User[] = [];
    snapshot.forEach((doc) => {
      const user = new User(doc.id);
      followers.push(user);
    });
    return followers;
  }
}
