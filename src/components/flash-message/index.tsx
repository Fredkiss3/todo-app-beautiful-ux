"use client";
import * as React from "react";
import toast from "react-hot-toast";
import { getFlash } from "./_actions";

export default function FlashMessage() {
  React.useEffect(() => {
    getFlash().then((flash) => {
      if (flash) {
        if (flash.type === "error") {
          toast.error(flash.message);
        } else {
          toast.success(flash.message);
        }
      }
    });
  }, []);
  return null;
}
