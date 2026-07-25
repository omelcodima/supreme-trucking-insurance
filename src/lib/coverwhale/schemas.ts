import "server-only";

import { z } from "zod";

export const AuthResponseSchema = z.object({
  AccessToken: z.string().min(1),
  RefreshToken: z.string().min(1),
  ExpiresIn: z.number().int().positive(),
}).strict();

const FieldMessagesSchema = z.union([
  z.string(),
  z.array(z.string()),
]);

const FieldErrorsSchema = z.record(z.string(), FieldMessagesSchema);

export const ValidationErrorSchema = z.object({
  message: z.string(),
  errors: z.union([
    z.array(z.string()),
    FieldErrorsSchema,
  ]),
}).strict();

export const StatusErrorSchema = z.object({
  status: z.string(),
  error: z.string(),
}).strict();

export const AuthErrorSchema = z.object({
  Error: z.string(),
}).strict();

export type CoverWhaleAuthResponse = z.infer<typeof AuthResponseSchema>;
export type CoverWhaleValidationError = z.infer<typeof ValidationErrorSchema>;
export type CoverWhaleStatusError = z.infer<typeof StatusErrorSchema>;
export type CoverWhaleAuthError = z.infer<typeof AuthErrorSchema>;
