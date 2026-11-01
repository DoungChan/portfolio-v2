import type { AppPayload } from "@/components/os/WindowManager";

export interface AppProps {
   /** Data the app was opened with (e.g. from Spotlight). */
   payload?: AppPayload;
   /** Changes whenever a new payload arrives, including for an already-open window. */
   payloadVersion: number;
}
