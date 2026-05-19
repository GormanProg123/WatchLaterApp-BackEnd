import { User } from 'src/infrastructure/database/schemas/user.entity';

export const excludePassword = (user: User) => {
  const { passwordHash, ...rest } = user;
  return rest;
};
