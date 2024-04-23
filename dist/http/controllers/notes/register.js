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

// src/http/controllers/notes/register.ts
var register_exports = {};
__export(register_exports, {
  registerNotes: () => registerNotes
});
module.exports = __toCommonJS(register_exports);

// src/lib/index.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();

// src/repositories/in-prisma-repositories/in-prisma-notes-repository.ts
var PrismaNotesRepository = class {
  async create(data) {
    const note = await prisma.note.create({ data });
    return note;
  }
  async fetchAll(user_id) {
    const notes = await prisma.note.findMany({ where: { user_id } });
    return notes;
  }
  async findByTitle(title) {
    const notes = await prisma.note.findMany({
      where: { title: { contains: title } }
    });
    return notes;
  }
  async findById(id) {
    const note = await prisma.note.findUnique({ where: { id } });
    return note;
  }
  async delete(id) {
    await prisma.note.delete({ where: { id } });
  }
};

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

// src/use-cases/notes/register.ts
var RegisterNoteUseCase = class {
  constructor(notesRepository, usersRepository) {
    this.notesRepository = notesRepository;
    this.usersRepository = usersRepository;
  }
  async execute({
    user_id,
    title,
    description,
    rating,
    arr_tags
  }) {
    const user = await this.usersRepository.findById(user_id);
    if (!user) {
      throw new InvalidCredentialError();
    }
    const note = await this.notesRepository.create({
      title,
      description,
      rating,
      arr_tags,
      user_id: user.id
    });
    return { note };
  }
};

// src/http/controllers/notes/register.ts
var import_zod = require("zod");
async function registerNotes(request, reply) {
  const requestBodySchema = import_zod.z.object({
    title: import_zod.z.string(),
    description: import_zod.z.string().optional(),
    rating: import_zod.z.coerce.number(),
    arr_tags: import_zod.z.array(import_zod.z.string())
  });
  const { title, description, rating, arr_tags } = requestBodySchema.parse(
    request.body
  );
  try {
    const notesRepository = new PrismaNotesRepository();
    const usersRepository = new PrismaUsersRepository();
    const useCase = new RegisterNoteUseCase(notesRepository, usersRepository);
    const { note } = await useCase.execute({
      user_id: request.user.sub,
      title,
      description,
      rating,
      arr_tags
    });
    return reply.status(200).send({ note });
  } catch (err) {
    if (err instanceof InvalidCredentialError) {
      return reply.status(400).send({ message: err.message });
    }
    throw err;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  registerNotes
});
