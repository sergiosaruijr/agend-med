import { Stethoscope } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

interface TopDoctorsListProps {
  doctors: {
    id: string;
    name: string;
    avatarImageUrl: string | null;
    specialty: string;
    appointments: number;
  }[];
}

export default function TopDoctors({ doctors }: TopDoctorsListProps) {
  return (
    <div className="mx-auto w-full max-w-md rounded-lg bg-gray-50 p-4">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Stethoscope className="text-muted-foreground" />
          <CardTitle className="text-base">Médicos</CardTitle>
        </div>
      </div>

      {/* Doctors List */}
      <div className="space-y-3">
        {doctors.map((doctor) => (
          <Card key={doctor.id} className="border-0 bg-white shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={
                      doctor.avatarImageUrl ||
                      "/placeholder.svg?height=48&width=48"
                    }
                    alt={doctor.name}
                  />
                  <AvatarFallback className="h-11 w-11 bg-gray-200 text-gray-600">
                    {doctor.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>

                {/* Doctor Info */}
                <div className="flex-1">
                  <h3 className="text-sm">{doctor.name}</h3>
                  <p className="text-muted-foreground text-sm">
                    {doctor.specialty}
                  </p>
                </div>

                {/* Appointments Count */}
                <div className="text-right">
                  <span className="text-muted-foreground gap-4 text-sm font-medium whitespace-nowrap">
                    {doctor.appointments} agend.
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
