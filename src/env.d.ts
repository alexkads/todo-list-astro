/// <reference path="../.astro/types.d.ts" />

declare namespace App {
  interface Locals {
    session?: {
      id: string;
      email: string;
      name: string;
      role: string;
    };
  }
}
