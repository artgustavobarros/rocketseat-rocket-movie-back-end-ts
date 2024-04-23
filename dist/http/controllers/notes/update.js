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

// src/http/controllers/notes/update.ts
var update_exports = {};
__export(update_exports, {
  updateNote: () => updateNote
});
module.exports = __toCommonJS(update_exports);

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

// src/use-cases/notes/update.ts
var UpdateNotesUseCase = class {
  constructor(noteRepository) {
    this.noteRepository = noteRepository;
  }
  async execute({
    id,
    title,
    description,
    rating,
    arr_tags
  }) {
    const note = await this.noteRepository.findById(id);
    if (!note) {
      throw new ContentNotFoundError();
    }
    note.title = title ?? note.title;
    note.description = description ?? note.description;
    note.rating = rating ?? note.rating;
    note.arr_tags = arr_tags ?? note.arr_tags;
    note.updated_at = /* @__PURE__ */ new Date();
    return { note };
  }
};

// src/utils/errors/invalid-credentials-error.ts
var InvalidCredentialError = class extends Error {
  constructor() {
    super("Invalid credential error");
  }
};

// src/http/controllers/notes/update.ts
var import_zod = require("zod");
async function updateNote(request, reply) {
  const requestBodySchema = import_zod.z.object({
    title: import_zod.z.string().optional(),
    description: import_zod.z.string().optional(),
    rating: import_zod.z.coerce.number().optional(),
    arr_tags: import_zod.z.array(import_zod.z.string()).optional()
  });
  const requestParamsSchema = import_zod.z.object({
    id: import_zod.z.string()
  });
  const { title, description, rating, arr_tags } = requestBodySchema.parse(
    request.body
  );
  const { id } = requestParamsSchema.parse(request.params);
  try {
    const repository = new PrismaNotesRepository();
    const useCase = new UpdateNotesUseCase(repository);
    const { note } = await useCase.execute({
      id,
      title,
      description,
      rating,
      arr_tags
    });
    await prisma.note.update({
      where: { id },
      data: { title, description, rating, arr_tags }
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
  updateNote
});
