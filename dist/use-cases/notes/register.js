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

// src/use-cases/notes/register.ts
var register_exports = {};
__export(register_exports, {
  RegisterNoteUseCase: () => RegisterNoteUseCase
});
module.exports = __toCommonJS(register_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RegisterNoteUseCase
});
