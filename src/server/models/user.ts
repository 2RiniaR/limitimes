import { repository } from "src/server/repositories/in-memory";

export interface UsersRepository {
  push(user: User): void;
  pull(user: User): void;
}

export class FollowingSelfError extends Error {}
export class AlreadyFollowedError extends Error {}
export class UnfollowTargetNotFoundError extends Error {}

export class User {
  private readonly _discordId?: string;
  private _followingUsers?: User[];

  constructor(discordId: string) {
    this._discordId = discordId;
  }

  public isExist(): boolean {
    return repository.isExist(this);
  }

  public update() {
    repository.push(this);
  }

  public create() {
    this._followingUsers = [];
    repository.push(this);
  }

  public fetch() {
    repository.pull(this);
  }

  private isSame(target: User): boolean {
    if (!target.discordId || !this.discordId) throw Error("require properties are undefined.");
    return this.discordId === target.discordId;
  }

  private isFollowing(target: User): boolean {
    if (!target.discordId || !this._followingUsers) throw Error("require properties are undefined.");
    return !!this._followingUsers.find((user) => user._discordId === target._discordId);
  }

  public followUser(target: User) {
    if (!this._followingUsers) throw Error("require properties are undefined.");
    if (this.isSame(target)) throw new FollowingSelfError();
    if (this.isFollowing(target)) throw new AlreadyFollowedError();
    this._followingUsers.push(target);
  }

  public unfollowUser(target: User) {
    if (!this._followingUsers) throw Error("require properties are undefined.");
    if (!this.isFollowing(target)) throw new UnfollowTargetNotFoundError();
    this._followingUsers = this._followingUsers.filter((user) => user.discordId !== target.discordId);
  }

  get discordId(): string | undefined {
    return this._discordId;
  }

  get followingUsers(): User[] | undefined {
    return this._followingUsers;
  }
}
