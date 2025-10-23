"use client"

import * as React from "react"
import { addDays, format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function DateRangePicker({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2024, 0, 20),
    to: new Date(),
  })

  const handlePresetChange = (value: string) => {
    const now = new Date();
    switch (value) {
        case "today":
            setDate({ from: now, to: now });
            break;
        case "yesterday":
            setDate({ from: addDays(now, -1), to: addDays(now, -1) });
            break;
        case "last7":
            setDate({ from: addDays(now, -6), to: now });
            break;
        case "last15":
            setDate({ from: addDays(now, -14), to: now });
            break;
        case "last30":
            setDate({ from: addDays(now, -29), to: now });
            break;
        case "last_quarter":
            // This is a simplified version. A real implementation might need more complex logic.
            setDate({ from: addDays(now, -90), to: now });
            break;
        case "last_semester":
            setDate({ from: addDays(now, -180), to: now });
            break;
        case "last_year":
            setDate({ from: addDays(now, -365), to: now });
            break;
        case "max":
            setDate({ from: new Date(2024, 0, 1), to: now });
            break;
        default:
            break;
    }
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y", { locale: ptBR })} -{" "}
                  {format(date.to, "LLL dd, y", { locale: ptBR })}
                </>
              ) : (
                format(date.from, "LLL dd, y", { locale: ptBR })
              )
            ) : (
              <span>Selecione uma data</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 flex" align="end">
          <div className="p-2 border-r">
            <Select onValueChange={handlePresetChange}>
              <SelectTrigger>
                <SelectValue placeholder="Períodos" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="today">Hoje</SelectItem>
                <SelectItem value="yesterday">Ontem</SelectItem>
                <SelectItem value="last7">Últimos 7 dias</SelectItem>
                <SelectItem value="last15">Últimos 15 dias</SelectItem>
                <SelectItem value="last30">Último mês</SelectItem>
                <SelectItem value="last_quarter">Último trimestre</SelectItem>
                <SelectItem value="last_semester">Último semestre</SelectItem>
                <SelectItem value="last_year">Último ano</SelectItem>
                <SelectItem value="max">Máximo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
            locale={ptBR}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
