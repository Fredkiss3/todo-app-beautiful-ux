"use client";
import * as React from "react";
import { useToast } from "~/components/ui/use-toast";
import { getFlashMessage } from "./_actions";

export type FlashMessageProps = {};

export function FlashMessage({}: FlashMessageProps) {
  const { toast } = useToast();
  React.useEffect(() => {
    getFlashMessage().then((msg) => {
      if (msg) {
        toast({
          description: msg,
        });
      }
    });
  }, [toast]);
  return null;
}
