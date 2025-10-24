"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface DateRangePickerProps {
  className?: string;
  value?: DateRange;
  onApply?: (range?: DateRange) => void;
  onChange?: (range?: DateRange) => void;
}

const defaultRange: DateRange = {
  from: addDays(new Date(), -13),
  to: new Date(),
};

const rangeKey = (range?: DateRange) =>
  `${range?.from ? range.from.toISOString() : ""}|${range?.to ? range.to.toISOString() : ""}`;

export function DateRangePicker({ className, value, onApply, onChange }: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [localRange, setLocalRange] = React.useState<DateRange | undefined>(value ?? defaultRange);

  const fromTimestamp = value?.from ? value.from.getTime() : null;
  const toTimestamp = value?.to ? value.to.getTime() : null;

  React.useEffect(() => {
    if (!value?.from && !value?.to) {
      setLocalRange(undefined);
      return;
    }
    setLocalRange(value);
  }, [fromTimestamp, toTimestamp, value]);

  const emitChange = React.useCallback(
    (next?: DateRange) => {
      setLocalRange(next);
      onChange?.(next);
    },
    [onChange]
  );

  const handlePresetChange = (preset: string) => {
    const now = new Date();
    let nextRange: DateRange | undefined;

    switch (preset) {
      case "today":
        nextRange = { from: now, to: now };
        break;
      case "yesterday":
        nextRange = { from: addDays(now, -1), to: addDays(now, -1) };
        break;
      case "last7":
        nextRange = { from: addDays(now, -6), to: now };
        break;
      case "last15":
        nextRange = { from: addDays(now, -14), to: now };
        break;
      case "last30":
        nextRange = { from: addDays(now, -29), to: now };
        break;
      case "last_quarter":
        nextRange = { from: addDays(now, -90), to: now };
        break;
      case "last_semester":
        nextRange = { from: addDays(now, -180), to: now };
        break;
      case "last_year":
        nextRange = { from: addDays(now, -365), to: now };
        break;
      case "max":
        nextRange = { from: new Date(2024, 0, 1), to: now };
        break;
      default:
        nextRange = localRange;
        break;
    }

    emitChange(nextRange);
  };

  const handleSelect = (next?: DateRange) => {
    emitChange(next);
  };

  const handleApply = () => {
    const appliedRange = localRange ?? value ?? defaultRange;
    onApply?.(appliedRange);
    setOpen(false);
  };

  const displayRange = localRange ?? defaultRange;

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "glass-button w-full justify-start text-left font-normal sm:w-[320px]",
              !displayRange && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {displayRange?.from ? (
              displayRange.to ? (
                <>
                  {format(displayRange.from, "LLL dd, y", { locale: ptBR })} -{" "}
                  {format(displayRange.to, "LLL dd, y", { locale: ptBR })}
                </>
              ) : (
                format(displayRange.from, "LLL dd, y", { locale: ptBR })
              )
            ) : (
              <span>Selecione uma data</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="flex w-auto flex-col gap-3 p-0 sm:flex-row" align="end">
          <div className="border-b p-3 sm:border-b-0 sm:border-r">
            <Select onValueChange={handlePresetChange}>
              <SelectTrigger className="glass-input w-[200px]">
                <SelectValue placeholder="Períodos" />
              </SelectTrigger>
              <SelectContent position="popper" className="glass-panel border-white/10">
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
            defaultMonth={displayRange?.from}
            selected={localRange}
            onSelect={handleSelect}
            numberOfMonths={2}
            locale={ptBR}
          />
          <div className="flex items-center justify-end gap-2 border-t p-3 sm:flex-col sm:items-stretch sm:justify-between sm:border-l sm:border-t-0">
            <Button variant="ghost" className="justify-center" onClick={() => emitChange(undefined)}>
              Limpar
            </Button>
            <Button onClick={handleApply} className="justify-center">
              Aplicar
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
