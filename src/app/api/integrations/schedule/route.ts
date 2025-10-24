import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSchedule, setSchedule } from "@/lib/server/schedule-store";

export async function GET() {
  const schedule = await getSchedule();
  return NextResponse.json({ schedule });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const frequency = body.frequency as "hourly" | "daily" | "custom" | undefined;
    const cron = body.cron as string | undefined;
    const timezone = body.timezone as string | undefined;

    if (!frequency) {
      return NextResponse.json({ message: "frequency é obrigatório." }, { status: 400 });
    }

    if (frequency === "custom" && !cron) {
      return NextResponse.json({ message: "cron é obrigatório para agendamento customizado." }, { status: 400 });
    }

    await setSchedule({ frequency, cron, timezone });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[API] integrations/schedule erro:", error);
    return NextResponse.json({ message: error.message ?? "Erro ao registrar agendamento." }, { status: 500 });
  }
}
