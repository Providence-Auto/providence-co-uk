// Whose contact details a spec sheet carries: the general head-office
// channels, or the person exporting it from /admin/specs.
//
// "Mine" is resolved on the server from the signed-in account
// (src/lib/spec-sheet-contact-server.ts) — never from details sent by the
// browser — so nobody can print a Providence-branded sheet with somebody
// else's, or made-up, contact details. This module is the pure half: the
// types and the general channels, safe for the PDF renderer and the editor.

import {
  CONTACT_EMAIL,
  GENERAL_WHATSAPP_NUMBER,
  HEAD_OFFICE_PHONE,
} from "@/config/contact";

export const SPEC_SHEET_CONTACT_CHOICES = ["general", "mine"] as const;
export type SpecSheetContactChoice =
  (typeof SPEC_SHEET_CONTACT_CHOICES)[number];

export type SpecSheetContact = {
  /** The consultant's name; absent on the general channels. */
  name?: string;
  email: string;
  whatsapp: string;
  phone: string;
};

export const GENERAL_SPEC_SHEET_CONTACT: SpecSheetContact = {
  email: CONTACT_EMAIL,
  whatsapp: GENERAL_WHATSAPP_NUMBER,
  phone: HEAD_OFFICE_PHONE,
};

export function parseContactChoice(value: unknown): SpecSheetContactChoice {
  return value === "mine" ? "mine" : "general";
}
