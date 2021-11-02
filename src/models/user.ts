import { repository } from "src/repositories/in-memory-store";

export interface UsersRepository {
  push(user: User): void;
  pull(user: User): void;
}

export class FollowingSelfError extends Error {}

export class User {
  private readonly _discordId?: string;
  private _followingUsers?: User[];
  private _followerUsers?: User[];

  constructor(discordId: string) {
    this._discordId = discordId;
  }

  public save() {
    repository.push(this);
  }

  public fetch() {
    repository.pull(this);
  }

  public followUser(target: User) {
    if (!this.discordId || !target.discordId) throw Error("require properties are undefined.");
    if (this.discordId === target.discordId) throw new FollowingSelfError();
    this.followingUsers?.push(target);
    target._followingUsers?.push(this);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public unfollowUser(target: User) {
    // ToDo: ユーザーをフォロー解除する
    // フィルタリングとかその他もろもろ
  }

  get discordId(): string | undefined {
    return this._discordId;
  }

  get followingUsers(): User[] | undefined {
    return this._followingUsers;
  }

  get followerUsers(): User[] | undefined {
    return this._followerUsers;
  }
}
