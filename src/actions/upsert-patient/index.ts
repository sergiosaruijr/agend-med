"use server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { patientsTable } from "@/db/schema";
import { protectedWithClinicActionClient } from "@/lib/next-safe-actions";

import { upsertPatientSchema } from "./schema";

export const upsertPatient = protectedWithClinicActionClient
  .schema(upsertPatientSchema)
  .action(async ({ parsedInput, ctx }) => {
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
          clinicId: ctx.user.clinic.id,
        })
        .returning();
      patient = inserted[0];
    }

    return { success: true, data: patient };
  });
