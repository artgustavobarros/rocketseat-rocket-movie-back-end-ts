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

// src/utils/storage.ts
var storage_exports = {};
__export(storage_exports, {
  MULTER: () => MULTER,
  TMP_FOLDER: () => TMP_FOLDER,
  UPLOAD_FOLDER: () => UPLOAD_FOLDER,
  upload: () => upload
});
module.exports = __toCommonJS(storage_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MULTER,
  TMP_FOLDER,
  UPLOAD_FOLDER,
  upload
});
