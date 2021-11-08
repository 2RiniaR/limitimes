import { repository } from "src/server/repositories";

export interface UsersRepository {
  isExist(id: string): Promise<boolean>;
  push(user: User): Promise<void>;
  pull(user: User): Promise<void>;
}

export class FollowingSelfError extends Error {}
export class NotFoundError extends Error {}
export class AlreadyFollowedError extends Error {}
export class AlreadyExistError extends Error {}
export class UnfollowTargetNotFoundError extends Error {}

export class User {
  public readonly id: string;
  private _followingUsers?: User[];
  private _followerUsers?: User[];

  constructor(id: string) {
    this.id = id;
  }

  public isExist(): Promise<boolean> {
    return repository.isExist(this.id);
  }

  public async update() {
    if (!(await this.isExist())) throw new NotFoundError();
    await repository.push(this);
  }

  public async create() {
    if (await this.isExist()) throw new AlreadyExistError();
    this._followingUsers = [];
    await repository.push(this);
  }

  public async fetch() {
    if (!(await this.isExist())) throw new NotFoundError();
    await repository.pull(this);
  }

  private isSame(target: User): boolean {
    return this.id === target.id;
  }

  private isFollowing(target: User): boolean {
    if (!this._followingUsers) throw Error("require properties are undefined.");
    return !!this._followingUsers.find((user) => user.id === target.id);
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
    this._followingUsers = this._followingUsers.filter((user) => user.id !== target.id);
  }

  get followingUsers(): User[] | undefined {
    return this._followingUsers;
  }

  get followerUsers(): User[] | undefined {
    return this._followerUsers;
  }
}
