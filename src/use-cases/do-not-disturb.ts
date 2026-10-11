"use client";

import { useState } from "react";
import { setDoNotDisturb } from "@/actions/user";
import { useAppDispatch, useAppSelector } from "@/providers/store/hooks";
import { patchCurrentUserData } from "@/store/slice/user";

export function useDoNotDisturb() {
  const dispatch = useAppDispatch();
  const doNotDisturb = useAppSelector(
    (state) => state.user.currentUserData?.doNotDisturb ?? false,
  );
  const [pending, setPending] = useState(false);

  const toggle = async () => {
    setPending(true);
    const saved = await setDoNotDisturb({ enabled: !doNotDisturb });
    setPending(false);

    if (saved) dispatch(patchCurrentUserData({ doNotDisturb: !doNotDisturb }));
  };

  return { doNotDisturb, pending, toggle };
}
