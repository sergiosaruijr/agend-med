"use client";

import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";

import { deletePatient } from "@/actions/delete-patient";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { patientsTable } from "@/db/schema";

import UpsertPatientForm from "./upsert-patient-form";

interface EditPatientButtonProps {
  patient: typeof patientsTable.$inferSelect;
}

const EditPatientButton = ({ patient }: EditPatientButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const deletePatientAction = useAction(deletePatient, {
    onSuccess: () => {
      toast.success("Paciente deletado com sucesso");
    },
    onError: (error) => {
      console.error("Erro na requisição:", error);
      toast.error("Erro ao deletar paciente");
    },
  });

  const handleDeletePatientClick = () => {
    if (!patient) return;
    deletePatientAction.execute({ id: patient.id });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="mr-2">
          Editar
        </Button>
      </DialogTrigger>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline">
            <TrashIcon />
            Deletar Médico
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Tem certeza que deseja deletar esse médico?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita. Isso irá deletar o médico
              permanentemente e todas as consultas agendadas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePatientClick}>
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <UpsertPatientForm
        patient={patient}
        onSuccess={() => {
          setIsOpen(false);
          router.refresh();
        }}
        isOpen={isOpen}
      />
    </Dialog>
  );
};

export default EditPatientButton;
