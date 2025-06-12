"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import { patientsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-actions";

import { upsertPatientSchema } from "./schema";

export const upsertPatient = actionClient
  .schema(upsertPatientSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user || !session.user.clinic) {
      return {
        success: false,
        error: "Usuário não autenticado ou clínica não encontrada.",
      };
    }

    const { id, name, email, phoneNumber, sex } = parsedInput;
    let patient;

    if (id) {
      // Update
      const updated = await db
        .update(patientsTable)
        .set({ name, email, phoneNumber, sex })
        .where(eq(patientsTable.id, id))
        .returning();
      patient = updated[0];
    } else {
      // Insert
      const inserted = await db
        .insert(patientsTable)
        .values({
          name,
          email,
          phoneNumber,
          sex,
          clinicId: session.user.clinic.id,
        })
        .returning();
      patient = inserted[0];
    }

    return { success: true, data: patient };
  });
