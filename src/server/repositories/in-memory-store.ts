import { User, UsersRepository } from "src/server/models/user";

export class InMemoryRepository implements UsersRepository {
  private users: { [id: string]: User } = {};

  public push(user: User) {
    if (!user.discordId) throw Error();
    this.users[user.discordId] = user;
  }

  public pull(user: User) {
    if (!user.discordId) throw Error();
    const source = this.users[user.discordId];
    if (!source) return;
    Object.assign(user, source);
  }
}

export const repository = new InMemoryRepository();
