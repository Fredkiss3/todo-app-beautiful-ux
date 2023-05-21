"use client";
import * as React from "react";
// utils
import toast from "react-hot-toast";
import { getFlash } from "~/app/(actions)/flash-message";
import { getCookieValue } from "~/lib/shared-utils";
import { FLASH_COOKIE_KEY } from "~/lib/constants";

export default function FlashMessage() {
  React.useEffect(() => {
    if (getCookieValue(FLASH_COOKIE_KEY)) {
      getFlash().then((flash) => {
        if (flash) {
          if (flash.type === "error") {
            toast.error(flash.message);
          } else {
            toast.success(flash.message);
          }
        }
      });
    }
  }, []);
  return null;
}
