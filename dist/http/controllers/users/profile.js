"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/http/controllers/users/profile.ts
var profile_exports = {};
__export(profile_exports, {
  profileUser: () => profileUser
});
module.exports = __toCommonJS(profile_exports);

// src/lib/index.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();

// src/repositories/in-prisma-repositories/in-prisma-users-repository.ts
var PrismaUsersRepository = class {
  async create(data) {
    const user = await prisma.user.create({ data });
    return user;
  }
  async findByEmail(email) {
    const user = await prisma.user.findUnique({ where: { email } });
    return user;
  }
  async findById(id) {
    const user = await prisma.user.findUnique({ where: { id } });
    return user;
  }
};

// src/utils/errors/user-not-found-error.ts
var UserNotFoundError = class extends Error {
  constructor() {
    super("User cannot be found.");
  }
};

// src/use-cases/users/profile.ts
var ProfileUserUseCase = class {
  constructor(usersRepository) {
    this.usersRepository = usersRepository;
  }
  async execute({
    id
  }) {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new UserNotFoundError();
    }
    return { user };
  }
};

// src/http/controllers/users/profile.ts
async function profileUser(request, reply) {
  try {
    const repository = new PrismaUsersRepository();
    const useCase = new ProfileUserUseCase(repository);
    const { user } = await useCase.execute({
      id: request.user.sub
    });
    return reply.status(200).send({ user: { ...user, password: "*****" } });
  } catch (err) {
    if (err instanceof UserNotFoundError) {
      return reply.status(400).send({ message: err.message });
    }
    throw err;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  profileUser
});
