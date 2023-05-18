"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "~/lib/utils";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

type DatePickerProps = {
  name: string;
};

export function DatePicker(props: DatePickerProps) {
  const [date, setDate] = React.useState<Date>();

  const [showCalendarPopup, setShowCalendarPopup] = React.useState(false);
  React.useEffect(() => {
    setShowCalendarPopup(true);
  }, []);

  return (
    <Popover>
      <PopoverTrigger asChild className="w-full">
        <div className="relative">
          <input
            tabIndex={showCalendarPopup ? -1 : 0}
            className={cn(
              "w-full justify-start text-left font-normal peer",
              !showCalendarPopup ? "text-primary" : "text-transparent"
            )}
            type="text"
            name={props.name}
            placeholder=" "
            defaultValue={date ? format(date, "yyyy-MM-dd") : ""}
          />
          <div
            hidden={!showCalendarPopup}
            className={cn(
              !showCalendarPopup
                ? "peer-placeholder-shown:text-muted-foreground text-transparent"
                : !date && "text-muted-foreground",
              "absolute flex left-4 top-1/2 -translate-y-1/2 items-center text-sm"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
