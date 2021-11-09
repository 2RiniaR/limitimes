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
      followings: data["followings"].toStringElements()
    };
  }

  public async exists(user: User | string): Promise<boolean> {
    const targetId = user instanceof User ? user.id : user;
    const doc = await this.users.doc(targetId).get();
    return doc.exists;
  }

  private async register(src: User) {
    const registered = await db.runTransaction(async (transaction) => {
      const ref = this.users.doc(src.id);
      const doc = await transaction.get(ref);
      if (doc.exists) return false;
      transaction.set(ref, {
        followings: []
      });
      return true;
    });

    if (!registered) return;
    Object.assign(src, {
      _followings: [],
      _followers: []
    });
  }

  private async pushFollowings(src: User) {
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
      _followings: Array.from(src.followings).map((id) => new User(id)),
      _followers: await this.getFollowers(dist)
    });
  }

  private async getFollowers(user: User): Promise<User[]> {
    const snapshot = await this.users.where("followings", "array-contains", user.id).get();
    const followers: User[] = [];
    snapshot.forEach((doc) => {
      const user = new User(doc.id);
      followers.push(user);
    });
    return followers;
  }
}
