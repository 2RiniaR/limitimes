import { User, UsersRepository } from "src/server/models/user";

type UserDocument = {
  readonly followingUsersId: Set<string>;
  readonly followerUsersId: Set<string>;
};

export class InMemoryRepository implements UsersRepository {
  private users: { [id: string]: UserDocument } = {};

  public async exists(user: User | string): Promise<boolean> {
    const targetId = user instanceof User ? user.id : user;
    return Promise.resolve(!!this.users[targetId]);
  }

  private async register(src: User) {
    if (await this.exists(src.id)) return;
    this.users[src.id] = {
      followerUsersId: new Set<string>(),
      followingUsersId: new Set<string>()
    };
  }

  private pushFollowingUsers(src: User) {
    if (!src.followings) return;
    const followingUsersId = src.followings.map((user) => user.id);
    this.users[src.id] = { ...this.users[src.id], followingUsersId: new Set<string>(followingUsersId) };
    followingUsersId.forEach((userId) => this.users[userId].followerUsersId.add(src.id));
  }

  public async push(src: User) {
    await this.register(src);
    this.pushFollowingUsers(src);
  }

  public async pull(dist: User) {
    const src = this.users[dist.id];
    if (!src) return;
    Object.assign(dist, {
      _followingUsers: Array.from(src.followingUsersId).map((id) => new User(id))
    });
    return Promise.resolve();
  }

  getFollowers(user: User): Promise<User[]> {
    const src = this.users[user.id];
    if (!src) throw Error();
    return Promise.resolve(Array.from(src.followerUsersId).map((id) => new User(id)));
  }
}
