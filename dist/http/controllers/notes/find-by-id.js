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

// src/http/controllers/notes/find-by-id.ts
var find_by_id_exports = {};
__export(find_by_id_exports, {
  findNoteById: () => findNoteById
});
module.exports = __toCommonJS(find_by_id_exports);

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

// src/utils/errors/content-not-found.ts
var ContentNotFoundError = class extends Error {
  constructor() {
    super("Content not found");
  }
};

// src/use-cases/notes/find-by-id.ts
var FindNotesById = class {
  constructor(notesRepository) {
    this.notesRepository = notesRepository;
  }
  async execute({ id }) {
    const note = await this.notesRepository.findById(id);
    if (!note) {
      throw new ContentNotFoundError();
    }
    return { note };
  }
};

// src/utils/errors/invalid-credentials-error.ts
var InvalidCredentialError = class extends Error {
  constructor() {
    super("Invalid credential error");
  }
};

// src/http/controllers/notes/find-by-id.ts
var import_zod = require("zod");
async function findNoteById(request, reply) {
  const requestQuerySchema = import_zod.z.object({
    id: import_zod.z.string()
  });
  const { id } = requestQuerySchema.parse(request.query);
  try {
    const repository = new PrismaNotesRepository();
    const useCase = new FindNotesById(repository);
    const { note } = await useCase.execute({ id });
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
  findNoteById
});
