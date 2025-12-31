/// <reference types="vite/client" />

declare interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  // ...add other VITE_* vars with their correct types...
}

declare interface ImportMeta {
  readonly env: ImportMetaEnv;
}

import { VNode } from "vue";

declare global {
  namespace JSX {
    interface Element extends VNode {}
    interface IntrinsicElements {
      [elem: string]: any;
    }
  }
}
