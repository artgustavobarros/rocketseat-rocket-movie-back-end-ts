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

// src/http/routes/users-routes.ts
var users_routes_exports = {};
__export(users_routes_exports, {
  userRoutes: () => userRoutes
});
module.exports = __toCommonJS(users_routes_exports);

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
async function userRoutes(app) {
  app.post("/register", registerUser);
  app.post("/login", authenticateUser);
  app.post("/update", { onRequest: verifyJWT }, updateUser);
  app.get("/profile", { onRequest: verifyJWT }, profileUser);
  app.patch(
    "/avatar",
    { onRequest: verifyJWT, preHandler: upload.single("avatar") },
    addUsersAvatar
  );
  app.get("/img/:filename", showAvatar);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  userRoutes
});
