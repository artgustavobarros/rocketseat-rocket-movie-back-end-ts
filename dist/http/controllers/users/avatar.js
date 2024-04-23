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

// src/http/controllers/users/avatar.ts
var avatar_exports = {};
__export(avatar_exports, {
  addUsersAvatar: () => addUsersAvatar
});
module.exports = __toCommonJS(avatar_exports);

// src/lib/index.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();

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

// src/utils/errors/invalid-credentials-error.ts
var InvalidCredentialError = class extends Error {
  constructor() {
    super("Invalid credential error");
  }
};

// src/http/controllers/users/avatar.ts
var import_zod = require("zod");
async function addUsersAvatar(request, reply) {
  const requestFileParas = import_zod.z.object({
    filename: import_zod.z.string()
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  addUsersAvatar
});
