import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const metadata: Metadata = {
  title: "DBFlex | Admin",
  robots: { index: false, follow: false },
};

const DBFLEX_LOGIN_URL = "https://providenceauto.dbflex.net/secure/login.aspx";

// DBFlex sends `X-Frame-Options: deny` and `frame-ancestors 'none'`, so its
// login cannot be embedded. Instead this is a plain HTML form that posts the
// same fields as DBFlex's own login form straight to DBFlex in a new tab.
// The browser sends the email and password to DBFlex directly, so they never
// reach our server, and DBFlex sets its session cookie on its own domain.
// The hidden `postback*` fields mirror DBFlex's form; if a DBFlex update
// changes them, the post lands on their login page and the link below still
// works.
export default function DbflexLoginPage() {
  return (
    <div className="p-6 lg:p-10 max-w-md mx-auto">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
        Sign in to DBFlex
      </h1>

      <form
        action={DBFLEX_LOGIN_URL}
        method="POST"
        target="_blank"
        className="mt-8 space-y-5 bg-white border border-black/5 rounded-2xl p-6 shadow-sm"
      >
        <input type="hidden" name="postback" value="login" />
        <input type="hidden" name="postbackaction" value="signin" />
        <input type="hidden" name="postbackanchor" value="login" />
        <input type="hidden" name="postbackcomplete" value="1" />

        <div className="space-y-2">
          <Label htmlFor="dbflex-email">Email</Label>
          <Input
            id="dbflex-email"
            name="email"
            type="email"
            autoComplete="username"
            maxLength={100}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dbflex-password">Password</Label>
          <Input
            id="dbflex-password"
            name="password"
            type="password"
            autoComplete="current-password"
            maxLength={32}
            required
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-zinc-600">
          <input
            type="checkbox"
            name="keep"
            value="1"
            className="size-4 accent-black"
          />
          Keep me signed in
        </label>

        <Button type="submit" className="w-full h-11 rounded-xl">
          Sign in
          <ExternalLink />
        </Button>
      </form>

      <a
        href={DBFLEX_LOGIN_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-block text-sm text-zinc-500 underline underline-offset-4 hover:text-black"
      >
        Open the DBFlex sign-in page instead
      </a>
    </div>
  );
}
