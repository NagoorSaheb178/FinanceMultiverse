import { z } from "zod";

// Define the schemas directly with Zod instead of using pgTable
export const userSchema = z.object({
  id: z.number(),
  username: z.string(),
  password: z.string(),
});

export const personaSchema = z.object({
  id: z.number(),
  userId: z.number(),
  personaType: z.string(),
  timestamp: z.string(),
});

export const insertUserSchema = userSchema.omit({ id: true });
export const insertPersonaSchema = personaSchema.omit({ id: true });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = z.infer<typeof userSchema>;

export type InsertPersona = z.infer<typeof insertPersonaSchema>;
export type Persona = z.infer<typeof personaSchema>;
