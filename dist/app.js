"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/app.ts
var app_exports = {};
__export(app_exports, {
  app: () => app
});
module.exports = __toCommonJS(app_exports);
var import_fastify = __toESM(require("fastify"));
var import_fastify_multer2 = __toESM(require("fastify-multer"));

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

// src/utils/errors/user-already-exists.ts
var UserAlreadyExistsError = class extends Error {
  constructor() {
    super("User already exists");
  }
};

// src/use-cases/users/register.ts
var import_bcryptjs = require("bcryptjs");
var RegisterUserUseCase = class {
  constructor(usersRepository) {
    this.usersRepository = usersRepository;
  }
  async execute({
    name,
    email,
    password
  }) {
    const userWithSameEmail = await this.usersRepository.findByEmail(email);
    if (userWithSameEmail) {
      throw new UserAlreadyExistsError();
    }
    const passwordHashed = await (0, import_bcryptjs.hash)(password, 6);
    const user = await this.usersRepository.create({
      name,
      email,
      password: passwordHashed
    });
    return { user };
  }
};

// src/http/controllers/users/register.ts
var import_zod = require("zod");
var registerUser = async (request, reply) => {
  const requestBodySchema = import_zod.z.object({
    name: import_zod.z.string(),
    email: import_zod.z.string(),
    password: import_zod.z.string()
  });
  const { name, email, password } = requestBodySchema.parse(request.body);
  try {
    const repository = new PrismaUsersRepository();
    const useCase = new RegisterUserUseCase(repository);
    const { user } = await useCase.execute({
      name,
      email,
      password
    });
    return reply.status(201).send({ user });
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: err.message });
    }
    throw err;
  }
};

// src/utils/errors/invalid-credentials-error.ts
var InvalidCredentialError = class extends Error {
  constructor() {
    super("Invalid credential error");
  }
};

// src/use-cases/users/authenticate.ts
var import_bcryptjs2 = require("bcryptjs");
var AuthenticateUserUseCase = class {
  constructor(usersRepository) {
    this.usersRepository = usersRepository;
  }
  async execute({
    email,
    password
  }) {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new InvalidCredentialError();
    }
    const passwordMatches = await (0, import_bcryptjs2.compare)(password, user.password);
    if (!passwordMatches) {
      throw new InvalidCredentialError();
    }
    return { user };
  }
};

// src/http/controllers/users/authenticate.ts
var import_zod2 = require("zod");
async function authenticateUser(request, reply) {
  const requestBodySchema = import_zod2.z.object({
    email: import_zod2.z.string(),
    password: import_zod2.z.string()
  });
  const { email, password } = requestBodySchema.parse(request.body);
  try {
    const repository = new PrismaUsersRepository();
    const useCase = new AuthenticateUserUseCase(repository);
    const { user } = await useCase.execute({
      email,
      password
    });
    const token = await reply.jwtSign(
      {},
      {
        sign: {
          sub: user.id
        }
      }
    );
    const refreshToken = await reply.jwtSign(
      {},
      {
        sign: {
          sub: user.id,
          expiresIn: "7d"
        }
      }
    );
    return reply.setCookie("refreshToken", refreshToken, {
      path: "/",
      secure: true,
      sameSite: true,
      httpOnly: true
    }).status(200).send({ user, token });
  } catch (err) {
    if (err instanceof InvalidCredentialError) {
      return reply.status(400).send({ message: err.message });
    }
    throw err;
  }
}

// src/use-cases/users/update.ts
var import_bcryptjs3 = require("bcryptjs");
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
      const passwordMatches = await (0, import_bcryptjs3.compare)(old_password, user.password);
      if (!passwordMatches) {
        throw new InvalidCredentialError();
      }
      const newPasswordHashed = await (0, import_bcryptjs3.hash)(new_password, 6);
      user.password = newPasswordHashed;
    }
    user.updated_at = /* @__PURE__ */ new Date();
    return { user };
  }
};

// src/http/controllers/users/update.ts
var import_zod3 = require("zod");
async function updateUser(request, reply) {
  const requestBodySchema = import_zod3.z.object({
    name: import_zod3.z.string().optional(),
    email: import_zod3.z.string().optional(),
    old_password: import_zod3.z.string().optional(),
    new_password: import_zod3.z.string().optional()
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

// src/utils/storage.ts
var import_crypto = require("crypto");
var import_fastify_multer = __toESM(require("fastify-multer"));
var import_path = __toESM(require("path"));
var TMP_FOLDER = import_path.default.resolve(__dirname, "..", "temp");
var UPLOAD_FOLDER = import_path.default.resolve(TMP_FOLDER, "uploads");
var MULTER = {
  storage: import_fastify_multer.default.diskStorage({
    destination: TMP_FOLDER,
    filename(request, file, callback) {
      const filehash = (0, import_crypto.randomUUID)();
      const filename = `${filehash}-${file.originalname}`;
      return callback(null, filename);
    }
  })
};
var upload = (0, import_fastify_multer.default)(MULTER);

// src/http/controllers/users/show-avatar.ts
var import_zod4 = require("zod");
async function showAvatar(request, reply) {
  const requestParamsSchema = import_zod4.z.object({
    filename: import_zod4.z.string()
  });
  const { filename } = requestParamsSchema.parse(request.params);
  try {
    return reply.sendFile(filename);
  } catch (err) {
  }
}

// src/repositories/in-disk-storage-repositories/disk-storage.ts
var import_fs = __toESM(require("fs"));
var import_path2 = __toESM(require("path"));
var DiskStorageRepository = class {
  async saveFile(file) {
    await import_fs.default.promises.rename(
      import_path2.default.resolve(TMP_FOLDER, file),
      import_path2.default.resolve(UPLOAD_FOLDER, file)
    );
    return file;
  }
  async deleteFile(file) {
    const filePath = import_path2.default.resolve(UPLOAD_FOLDER, file);
    try {
      await import_fs.default.promises.stat(filePath);
    } catch {
    }
    await import_fs.default.promises.unlink(filePath);
  }
};

// src/http/controllers/users/avatar.ts
var import_zod5 = require("zod");
async function addUsersAvatar(request, reply) {
  const requestFileParas = import_zod5.z.object({
    filename: import_zod5.z.string()
  });
  const { filename } = requestFileParas.parse(request.file);
  try {
    const user = await prisma.user.findUnique({
      where: { id: request.user.sub }
    });
    if (!user) {
      throw new InvalidCredentialError();
    }
    const diskStorage = new DiskStorageRepository();
    if (user.avatar) {
      await diskStorage.deleteFile(user.avatar);
    }
    const avatar = await diskStorage.saveFile(filename);
    const updatedAt = /* @__PURE__ */ new Date();
    await prisma.user.update({
      where: { id: request.user.sub },
      data: { avatar, updated_at: updatedAt }
    });
    return reply.status(200).send({ user });
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

// src/http/routes/users-routes.ts
async function userRoutes(app2) {
  app2.post("/register", registerUser);
  app2.post("/login", authenticateUser);
  app2.post("/update", { onRequest: verifyJWT }, updateUser);
  app2.get("/profile", { onRequest: verifyJWT }, profileUser);
  app2.patch(
    "/avatar",
    { onRequest: verifyJWT, preHandler: upload.single("avatar") },
    addUsersAvatar
  );
  app2.get("/img/:filename", showAvatar);
}

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
var import_zod6 = require("zod");
async function registerNotes(request, reply) {
  const requestBodySchema = import_zod6.z.object({
    title: import_zod6.z.string(),
    description: import_zod6.z.string().optional(),
    rating: import_zod6.z.coerce.number(),
    arr_tags: import_zod6.z.array(import_zod6.z.string())
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
var import_zod7 = require("zod");
async function findNoteById(request, reply) {
  const requestQuerySchema = import_zod7.z.object({
    id: import_zod7.z.string()
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
var import_zod8 = require("zod");
async function findNoteByTitle(request, reply) {
  const requestQuerySchema = import_zod8.z.object({
    title: import_zod8.z.string()
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
var import_zod9 = require("zod");
async function deleteNote(request, reply) {
  const requestParamsSchema = import_zod9.z.object({
    id: import_zod9.z.string()
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
var import_zod10 = require("zod");
async function updateNote(request, reply) {
  const requestBodySchema = import_zod10.z.object({
    title: import_zod10.z.string().optional(),
    description: import_zod10.z.string().optional(),
    rating: import_zod10.z.coerce.number().optional(),
    arr_tags: import_zod10.z.array(import_zod10.z.string()).optional()
  });
  const requestParamsSchema = import_zod10.z.object({
    id: import_zod10.z.string()
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
async function notesRoutes(app2) {
  app2.addHook("onRequest", verifyJWT);
  app2.post("/register", registerNotes);
  app2.post("/update/:id", updateNote);
  app2.get("/findbyid", findNoteById);
  app2.get("/findbytitle", findNoteByTitle);
  app2.get("/", fetchNotesByUserId);
  app2.delete("/:id", deleteNote);
}

// src/app.ts
var import_static = __toESM(require("@fastify/static"));
var import_cors = __toESM(require("@fastify/cors"));
var import_jwt = __toESM(require("@fastify/jwt"));

// src/env/index.ts
var import_zod11 = require("zod");
var import_config = require("dotenv/config");
var envSchema = import_zod11.z.object({
  NODE_ENV: import_zod11.z.enum(["dev", "test", "production"]).default("dev"),
  PORT: import_zod11.z.coerce.number().default(3333),
  JWT_SECRET: import_zod11.z.string()
});
var response = envSchema.safeParse(process.env);
if (!response.success) {
  console.error("Invalid environment variables", response.error.format());
  throw new Error("Invalid environmnet variables");
}
var env = response.data;

// src/app.ts
var import_cookie = __toESM(require("@fastify/cookie"));
var import_zod12 = require("zod");
var app = (0, import_fastify.default)();
app.register(import_fastify_multer2.default.contentParser);
app.register(import_static.default, {
  root: UPLOAD_FOLDER
});
app.register(import_jwt.default, {
  secret: env.JWT_SECRET,
  sign: { expiresIn: "1d" },
  cookie: { cookieName: "refreshToken", signed: false }
});
app.register(import_cookie.default);
app.register(userRoutes, { prefix: "/users" });
app.register(notesRoutes, { prefix: "/notes" });
app.register(import_cors.default, {});
app.setErrorHandler((error, request, reply) => {
  if (error instanceof import_zod12.ZodError) {
    return reply.status(400).send({ message: "Validation error.", issues: error.format() });
  }
  if (env.NODE_ENV !== "production") {
    console.error(error);
  }
  return reply.status(500).send({ message: "Internal server error." });
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  app
});
