import { User, UsersRepository } from "src/server/models/user";

type UserDocument = {
  readonly followingUsersId: Set<string>;
  readonly followerUsersId: Set<string>;
};

export class InMemoryRepository implements UsersRepository {
  private users: { [id: string]: UserDocument } = {};

  public isExist(user: User | string): boolean {
    const targetId = user instanceof User ? user.discordId : user;
    return !!this.users[targetId];
  }

  private register(src: User) {
    if (this.isExist(src.discordId)) return;
    this.users[src.discordId] = {
      followerUsersId: new Set<string>(),
      followingUsersId: new Set<string>()
    };
  }

  private pushFollowingUsers(src: User) {
    if (!src.followingUsers) return;
    const followingUsersId = src.followingUsers.map((user) => user.discordId);
    this.users[src.discordId] = { ...this.users[src.discordId], followingUsersId: new Set<string>(followingUsersId) };
    followingUsersId.forEach((userId) => this.users[userId].followerUsersId.add(src.discordId));
  }

  private pushFollowerUsers(src: User) {
    if (!src.followerUsers) return;
    const followerUsersId = src.followerUsers.map((user) => user.discordId);
    this.users[src.discordId] = { ...this.users[src.discordId], followerUsersId: new Set<string>(followerUsersId) };
    followerUsersId.forEach((userId) => this.users[userId].followingUsersId.add(src.discordId));
  }

  public push(src: User) {
    this.register(src);
    this.pushFollowingUsers(src);
    this.pushFollowerUsers(src);
  }

  public pull(dist: User) {
    const src = this.users[dist.discordId];
    if (!src) return;
    Object.assign(dist, {
      _followingUsers: Array.from(src.followingUsersId).map((id) => new User(id)),
      _followerUsers: Array.from(src.followerUsersId).map((id) => new User(id))
    });
  }
}

export const repository = new InMemoryRepository();
