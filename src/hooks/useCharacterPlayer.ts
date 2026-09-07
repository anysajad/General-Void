import { useRef, useEffect, useCallback, useState } from "react";

export type CharacterState = "seated" | "rising" | "aiming" | "sitting";

export interface CharacterPlayer {
  readonly state: CharacterState;
  readonly isReady: boolean;
  rise(): Promise<void>;
  sit(): Promise<void>;
  holdAiming(): void;
  onStateChange(cb: (s: CharacterState) => void): () => void;
}

const CROSSFADE_MS = 120;

export function useCharacterPlayer(
  videoRiseRef: React.RefObject<HTMLVideoElement | null>,
  videoSitRef: React.RefObject<HTMLVideoElement | null>,
  onLoadingProgress?: (p: number) => void
): CharacterPlayer {
  const stateRef = useRef<CharacterState>("seated");
  const [isReady, setIsReady] = useState(false);
  const pendingIntentRef = useRef<"rise" | "sit" | null>(null);
  const stateChangeCbRef = useRef<((s: CharacterState) => void) | null>(null);
  const riseRef = useRef<() => Promise<void>>(null as never);
  const sitRef = useRef<() => Promise<void>>(null as never);

  const notify = useCallback((s: CharacterState) => {
    stateChangeCbRef.current?.(s);
  }, []);

  const emitState = useCallback((s: CharacterState) => {
    stateRef.current = s;
    notify(s);
  }, [notify]);

  const showVideo = useCallback((el: HTMLVideoElement) => {
    el.style.opacity = "1";
  }, []);

  const hideVideo = useCallback((el: HTMLVideoElement) => {
    el.style.opacity = "0";
  }, []);

  const resetToStart = useCallback(
    (el: HTMLVideoElement): Promise<void> =>
      new Promise((resolve) => {
        if (el.currentTime < 0.01) {
          resolve();
          return;
        }
        el.currentTime = 0;
        el.addEventListener("seeked", () => resolve(), { once: true });
      }),
    []
  );

  const crossfadeToRise = useCallback(async () => {
    const sitEl = videoSitRef.current;
    const riseEl = videoRiseRef.current;
    if (!sitEl || !riseEl) return;

    await resetToStart(sitEl);

    showVideo(riseEl);
    riseEl.currentTime = 0;
    try {
      riseEl.play();
    } catch {
      // Autoplay blocked
    }

    await new Promise<void>((r) => {
      sitEl.animate(
        [{ opacity: 1 }, { opacity: 0 }],
        { duration: CROSSFADE_MS, fill: "forwards" }
      ).onfinish = () => r();
    });
    sitEl.pause();
    hideVideo(sitEl);
  }, [videoRiseRef, videoSitRef, resetToStart, showVideo, hideVideo]);

  const crossfadeToSit = useCallback(async () => {
    const riseEl = videoRiseRef.current;
    const sitEl = videoSitRef.current;
    if (!riseEl || !sitEl) return;

    await resetToStart(riseEl);

    showVideo(sitEl);
    sitEl.currentTime = 0;
    try {
      sitEl.play();
    } catch {
      // Autoplay blocked
    }

    await new Promise<void>((r) => {
      riseEl.animate(
        [{ opacity: 1 }, { opacity: 0 }],
        { duration: CROSSFADE_MS, fill: "forwards" }
      ).onfinish = () => r();
    });
    riseEl.pause();
    hideVideo(riseEl);
  }, [videoRiseRef, videoSitRef, resetToStart, showVideo, hideVideo]);

  const resolvePending = useCallback(async () => {
    const intent = pendingIntentRef.current;
    pendingIntentRef.current = null;
    if (intent === "rise") {
      await riseRef.current();
    } else if (intent === "sit") {
      await sitRef.current();
    }
  }, []);

  riseRef.current = async (): Promise<void> => {
    if (stateRef.current === "rising") return;
    if (stateRef.current === "aiming") {
      emitState("aiming");
      return;
    }

    if (stateRef.current === "sitting") {
      pendingIntentRef.current = "rise";
      return;
    }

    emitState("rising");
    await crossfadeToRise();
    emitState("aiming");
    await resolvePending();
  };

  sitRef.current = async (): Promise<void> => {
    if (stateRef.current === "sitting") return;
    if (stateRef.current === "seated") return;

    if (stateRef.current === "rising") {
      pendingIntentRef.current = "sit";
      return;
    }

    if (stateRef.current === "aiming") {
      pendingIntentRef.current = "sit";
      return;
    }

    emitState("sitting");
    await crossfadeToSit();
    emitState("seated");
    await resolvePending();
  };

  const rise = useCallback(async (): Promise<void> => {
    await riseRef.current();
  }, []);

  const sit = useCallback(async (): Promise<void> => {
    await sitRef.current();
  }, []);

  const holdAiming = useCallback(() => {
    const riseEl = videoRiseRef.current;
    const sitEl = videoSitRef.current;
    if (riseEl) {
      riseEl.pause();
      showVideo(riseEl);
    }
    if (sitEl) hideVideo(sitEl);
    emitState("aiming");
  }, [videoRiseRef, videoSitRef, showVideo, hideVideo, emitState]);

  useEffect(() => {
    const riseEl = videoRiseRef.current;
    const sitEl = videoSitRef.current;
    if (!riseEl || !sitEl) return;

    let loaded = 0;
    const total = 2;

    const updateProgress = () => {
      loaded++;
      onLoadingProgress?.(loaded / total);
    };

    const checkReady = () => {
      if (loaded >= total) setIsReady(true);
    };

    const riseHandler = () => {
      updateProgress();
      checkReady();
    };
    const sitHandler = () => {
      updateProgress();
      checkReady();
    };

    riseEl.addEventListener("canplaythrough", riseHandler, { once: true });
    sitEl.addEventListener("canplaythrough", sitHandler, { once: true });

    riseEl.load();
    sitEl.load();

    if (riseEl.readyState >= 4) {
      updateProgress();
      checkReady();
    }
    if (sitEl.readyState >= 4) {
      updateProgress();
      checkReady();
    }

    return () => {
      riseEl.removeEventListener("canplaythrough", riseHandler);
      sitEl.removeEventListener("canplaythrough", sitHandler);
    };
  }, [videoRiseRef, videoSitRef, onLoadingProgress]);

  return {
    get state() {
      return stateRef.current;
    },
    isReady,
    rise,
    sit,
    holdAiming,
    onStateChange(cb: (s: CharacterState) => void) {
      stateChangeCbRef.current = cb;
      return () => {
        stateChangeCbRef.current = null;
      };
    },
  };
}
