"use server";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { doctorsTable } from "@/db/schema";
import { protectedWithClinicActionClient } from "@/lib/next-safe-actions";

import { upsertDoctorSchema } from "./schema";

dayjs.extend(utc);

export const upsertDoctor = protectedWithClinicActionClient
  .schema(upsertDoctorSchema)
  .action(async ({ parsedInput, ctx }) => {
    try {
      const availableFromTime = parsedInput.availableFromTime;
      const availableToTime = parsedInput.availableToTime;

      const availableFromTimeUtc = dayjs()
        .set("hour", parseInt(availableFromTime.split(":")[0]))
        .set("minute", parseInt(availableFromTime.split(":")[1]))
        .set("second", parseInt(availableFromTime.split(":")[2]))
        .utc();
      const availableToTimeUtc = dayjs()
        .set("hour", parseInt(availableToTime.split(":")[0]))
        .set("minute", parseInt(availableToTime.split(":")[1]))
        .set("second", parseInt(availableToTime.split(":")[2]))
        .utc();

      console.log("Dados recebidos para inserção:", parsedInput);
      console.log("ID da clínica:", ctx.user.clinic.id);

      const insertData = {
        id: parsedInput.id,
        ...parsedInput,
        clinicId: ctx.user.clinic.id,
        availableFromTime: availableFromTimeUtc.format("HH:mm:ss"),
        availableToTime: availableToTimeUtc.format("HH:mm:ss"),
      };

      const result = await db
        .insert(doctorsTable)
        .values(insertData)
        .onConflictDoUpdate({
          target: doctorsTable.id,
          set: {
            name: parsedInput.name,
            specialty: parsedInput.specialty,
            appointmentPriceInCents: parsedInput.appointmentPriceInCents,
            availableFromWeekDay: parsedInput.availableFromWeekDay,
            availableToWeekDay: parsedInput.availableToWeekDay,
            availableFromTime: availableFromTimeUtc.format("HH:mm:ss"),
            availableToTime: availableToTimeUtc.format("HH:mm:ss"),
          },
        })
        .returning();

      revalidatePath("/doctors");

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
