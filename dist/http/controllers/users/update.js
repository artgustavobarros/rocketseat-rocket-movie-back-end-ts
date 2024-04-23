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

// src/http/controllers/users/update.ts
var update_exports = {};
__export(update_exports, {
  updateUser: () => updateUser
});
module.exports = __toCommonJS(update_exports);

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

// src/utils/errors/invalid-credentials-error.ts
var InvalidCredentialError = class extends Error {
  constructor() {
    super("Invalid credential error");
  }
};

// src/use-cases/users/update.ts
var import_bcryptjs = require("bcryptjs");
var UpdateUserUseCase = class {
  constructor(usersRepository) {
    this.usersRepository = usersRepository;
  }
  async execute({
    id,
    name,
    email,
    old_password,
    new_password
  }) {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new InvalidCredentialError();
    }
    user.name = name ?? user.name;
    user.email = email ?? user.email;
    if (old_password && new_password) {
      const passwordMatches = await (0, import_bcryptjs.compare)(old_password, user.password);
      if (!passwordMatches) {
        throw new InvalidCredentialError();
      }
      const newPasswordHashed = await (0, import_bcryptjs.hash)(new_password, 6);
      user.password = newPasswordHashed;
    }
    user.updated_at = /* @__PURE__ */ new Date();
    return { user };
  }
};

// src/http/controllers/users/update.ts
var import_zod = require("zod");
async function updateUser(request, reply) {
  const requestBodySchema = import_zod.z.object({
    name: import_zod.z.string().optional(),
    email: import_zod.z.string().optional(),
    old_password: import_zod.z.string().optional(),
    new_password: import_zod.z.string().optional()
  });
  const { name, email, old_password, new_password } = requestBodySchema.parse(
    request.body
  );
  try {
    const repository = new PrismaUsersRepository();
    const useCase = new UpdateUserUseCase(repository);
    const { user } = await useCase.execute({
      id: request.user.sub,
      name,
      email,
      old_password,
      new_password
    });
    await prisma.user.update({
      where: { id: request.user.sub },
      data: { name: user.name, email: user.email, password: user.password }
    });
    return reply.status(200).send({ user });
  } catch (err) {
    if (err instanceof InvalidCredentialError) {
      return reply.status(400).send({ message: err.message });
    }
    throw err;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  updateUser
});
