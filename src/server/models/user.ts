import { repository } from "src/server/repositories/in-memory";

export interface UsersRepository {
  push(user: User): void;
  pull(user: User): void;
}

export class FollowingSelfError extends Error {}
export class NotFoundError extends Error {}
export class AlreadyFollowedError extends Error {}
export class AlreadyExistError extends Error {}
export class UnfollowTargetNotFoundError extends Error {}

export class User {
  public readonly discordId: string;
  private _followingUsers?: User[];
  private _followerUsers?: User[];

  constructor(discordId: string) {
    this.discordId = discordId;
  }

  public isExist(): boolean {
    return repository.isExist(this);
  }

  public update() {
    if (!this.isExist()) throw new NotFoundError();
    repository.push(this);
  }

  public create() {
    if (this.isExist()) throw new AlreadyExistError();
    this._followingUsers = [];
    repository.push(this);
  }

  public fetch() {
    if (!this.isExist()) throw new NotFoundError();
    repository.pull(this);
  }

  private isSame(target: User): boolean {
    if (!target.discordId || !this.discordId) throw Error("require properties are undefined.");
    return this.discordId === target.discordId;
  }

  private isFollowing(target: User): boolean {
    if (!target.discordId || !this._followingUsers) throw Error("require properties are undefined.");
    return !!this._followingUsers.find((user) => user.discordId === target.discordId);
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

  get followingUsers(): User[] | undefined {
    return this._followingUsers;
  }

  get followerUsers(): User[] | undefined {
    return this._followerUsers;
  }
}
