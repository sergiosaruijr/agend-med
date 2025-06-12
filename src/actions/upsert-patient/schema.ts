import { z } from "zod";

export const upsertPatientSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1, { message: "Nome é obrigatório" }),
  email: z.string().email({ message: "E-mail inválido" }),
  phoneNumber: z.string().min(10, { message: "Telefone é obrigatório" }),
  sex: z.enum(["male", "female", "other"], { message: "Sexo é obrigatório" }),
});
