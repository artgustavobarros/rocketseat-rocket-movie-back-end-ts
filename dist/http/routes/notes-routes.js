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

// src/http/routes/notes-routes.ts
var notes_routes_exports = {};
__export(notes_routes_exports, {
  notesRoutes: () => notesRoutes
});
module.exports = __toCommonJS(notes_routes_exports);

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

// src/http/controllers/notes/find-by-id.ts
var import_zod2 = require("zod");
async function findNoteById(request, reply) {
  const requestQuerySchema = import_zod2.z.object({
    id: import_zod2.z.string()
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

// src/use-cases/notes/fetch-by-title.ts
var FetchNotesByTitleUseCase = class {
  constructor(notesRepository) {
    this.notesRepository = notesRepository;
  }
  async execute({
    title
  }) {
    const notes = await this.notesRepository.findByTitle(title);
    return { notes };
  }
};

// src/http/controllers/notes/fetch-by-title.ts
var import_zod3 = require("zod");
async function findNoteByTitle(request, reply) {
  const requestQuerySchema = import_zod3.z.object({
    title: import_zod3.z.string()
  });
  const { title } = requestQuerySchema.parse(request.query);
  try {
    const repository = new PrismaNotesRepository();
    const useCase = new FetchNotesByTitleUseCase(repository);
    const { notes } = await useCase.execute({ title });
    return reply.status(200).send({ notes });
  } catch (err) {
    if (err instanceof InvalidCredentialError) {
      return reply.status(400).send({ message: err.message });
    }
    throw err;
  }
}

// src/use-cases/notes/delete.ts
var DeleteNoteUseCase = class {
  constructor(noteRepository) {
    this.noteRepository = noteRepository;
  }
  async execute({ id }) {
    await this.noteRepository.delete(id);
  }
};

// src/http/controllers/notes/delete.ts
var import_zod4 = require("zod");
async function deleteNote(request, reply) {
  const requestParamsSchema = import_zod4.z.object({
    id: import_zod4.z.string()
  });
  const { id } = requestParamsSchema.parse(request.params);
  try {
    const repository = new PrismaNotesRepository();
    const useCase = new DeleteNoteUseCase(repository);
    await useCase.execute({ id });
    return reply.status(202).send({ message: "note deleted" });
  } catch (err) {
    if (err instanceof InvalidCredentialError) {
      return reply.status(400).send({ message: err.message });
    }
    throw err;
  }
}

// src/http/middlewares/verify-jwt.ts
async function verifyJWT(request, reply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    return reply.status(401).send({ message: "Unauthorized." });
  }
}

// src/use-cases/notes/fetch-all-notes.ts
var FetchAllNotes = class {
  constructor(notesRepository) {
    this.notesRepository = notesRepository;
  }
  async execute({
    user_id
  }) {
    const notes = await this.notesRepository.fetchAll(user_id);
    if (!notes) {
      throw new ContentNotFoundError();
    }
    return { notes };
  }
};

// src/http/controllers/notes/fetch-all.ts
async function fetchNotesByUserId(request, reply) {
  try {
    const repository = new PrismaNotesRepository();
    const useCase = new FetchAllNotes(repository);
    const { notes } = await useCase.execute({ user_id: request.user.sub });
    return reply.status(200).send({ notes });
  } catch (err) {
    if (err instanceof ContentNotFoundError) {
      return reply.status(400).send({ message: err.message });
    }
    throw err;
  }
}

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

// src/http/controllers/notes/update.ts
var import_zod5 = require("zod");
async function updateNote(request, reply) {
  const requestBodySchema = import_zod5.z.object({
    title: import_zod5.z.string().optional(),
    description: import_zod5.z.string().optional(),
    rating: import_zod5.z.coerce.number().optional(),
    arr_tags: import_zod5.z.array(import_zod5.z.string()).optional()
  });
  const requestParamsSchema = import_zod5.z.object({
    id: import_zod5.z.string()
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

// src/http/routes/notes-routes.ts
async function notesRoutes(app) {
  app.addHook("onRequest", verifyJWT);
  app.post("/register", registerNotes);
  app.post("/update/:id", updateNote);
  app.get("/findbyid", findNoteById);
  app.get("/findbytitle", findNoteByTitle);
  app.get("/", fetchNotesByUserId);
  app.delete("/:id", deleteNote);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  notesRoutes
});
