import { repository } from "src/repositories/in-memory-store";

export interface UsersRepository {
  push(user: User): void;
  pull(user: User): void;
}

export class FollowingSelfError extends Error {}
export class UnfollowTargetNotFoundError extends Error {}

export class User {
  private readonly _discordId?: string;
  private _followingUsers?: User[];

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
    if (!this.discordId || !target.discordId || !this._followingUsers) {
      throw Error("require properties are undefined.");
    }

    if (this.discordId === target.discordId) {
      throw new FollowingSelfError();
    }
    this._followingUsers.push(target);
  }

  public unfollowUser(target: User) {
    if (!this.discordId || !target.discordId || !this._followingUsers) {
      throw Error("require properties are undefined.");
    }

    const beforeLength = this._followingUsers.length;
    this._followingUsers = this._followingUsers?.filter((user) => user.discordId !== target.discordId);
    if (beforeLength === this._followingUsers?.length) {
      throw new UnfollowTargetNotFoundError();
    }
  }

  get discordId(): string | undefined {
    return this._discordId;
  }

  get followingUsers(): User[] | undefined {
    return this._followingUsers;
  }
}
