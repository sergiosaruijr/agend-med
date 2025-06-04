"use server";

import { headers } from "next/headers";

import { db } from "@/db";
import { doctorsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-actions";

import { upsertDoctorSchema } from "./schema";

export const upsertDoctor = actionClient
  .schema(upsertDoctorSchema)
  .action(async ({ parsedInput }) => {
    try {
      const session = await auth.api.getSession({
        headers: await headers(),
      });

      if (!session?.user) {
        throw new Error("Unauthorized");
      }
      if (!session.user.clinic?.id) {
        throw new Error("Clinic not found");
      }

      console.log("Dados recebidos para inserção:", parsedInput);
      console.log("ID da clínica:", session.user.clinic.id);

      const insertData = {
        id: parsedInput.id,
        ...parsedInput,
        clinicId: session.user.clinic.id,
      };

      // Tenta inserir diretamente
      const result = await db
        .insert(doctorsTable)
        .values(insertData)
        .returning();

      if (!result || result.length === 0) {
        throw new Error("Falha ao inserir médico");
      }

      return { success: true, data: result[0] };
    } catch (error) {
      console.error("Erro detalhado ao cadastrar médico:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      };
    }
  });
