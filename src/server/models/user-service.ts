import { User } from "src/server/models/user";
import { db } from "src/server/firebase";

type CreateUserProps = Pick<User, "id">;

export class UserService {
  public readonly users = db.collection("users");

  public get(id: string): User {
    return new User({
      id,
      service: this
    });
  }

  public async registerIfNotExist(props: CreateUserProps): Promise<User | null> {
    return await db.runTransaction(async (transaction) => {
      const ref = this.users.doc(props.id);
      const doc = await transaction.get(ref);
      if (doc.exists) return null;
      transaction.set(ref, { followings: [] });
      return new User({ id: props.id, service: this });
    });
  }
}
