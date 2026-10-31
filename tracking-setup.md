# Lead tracking setup — website, GTM, Meta, Google Ads

How a lead on providenceauto.co.uk reaches the ad platforms, and the manual
steps in GTM, Meta Events Manager and Google Ads that the code relies on.
Checked against the live GTM container (GTM-K7GCCZXQ, version 13), the Meta
dataset (1783158525559180) and the code on 2026-11-01.

## 1. What the site sends

| Moment | Where | What |
| --- | --- | --- |
| Car-buyer form completed (contact preferences saved) | Browser, `src/components/requestForm.tsx` | `dataLayer` event `generate_lead`, `lead_type: "car_buyer"` |
| Dealer inquiry stored | Browser, `src/components/dealer/DealerInquiryForm.tsx` | `dataLayer` event `generate_lead`, `lead_type: "dealer"` |
| Car-buyer lead set to *SQL: Moved to vehicle offering stage* | Server, `src/actions/admin-actions.ts` | Meta CAPI `QualifiedLead`, Google Ads offline click conversion |
| Car-buyer deal reaches *Deposit Collected* | Server, same | Meta CAPI `Purchase` |
| Dealer inquiry set to **Qualified** | Server, `src/actions/dealer-inquiry-actions.ts` | Meta CAPI `QualifiedDealerLead`, Google Ads (dealer qualified action) |
| Dealer inquiry set to **Onboarded** | Server, same | Meta CAPI `DealerOnboarded`, Google Ads (dealer onboarded action) |

Every `generate_lead` push carries `lead_type`, `lead_reference` (our id, not
personal data), `form_name` and `destination_country`; the dealer push also
carries `car_count`. Nothing personal goes into the `dataLayer`.

Server uploads fire **on the status change only** and are recorded in a
ledger (`request.*SentAt`, `dealerinquiry.*SentAt`), so nothing is sent twice
and nothing already in that status when this shipped is backfilled. The
mapping lives in `src/lib/leadConversion.ts` (car buyers) and
`src/lib/dealerConversion.ts` (dealers: Qualified = qualified lead, Onboarded
= conversion, business instruction 2026-11-01).

## 2. What the GTM container already does (no change needed)

- **Meta pixel tag** (Facebook Pixel template, event name = variable) fires on
  every custom `dataLayer` event. A lookup table renames `generate_lead` to
  Meta's standard **`Lead`**. Meta's own CAPI Gateway copies each browser
  event server-side with the same event id.
- **GA4 event tag** forwards every custom event to GA4 (G-B4ZR1YLXME) through
  the server-side GTM endpoint.

So the moment the code deploys, Meta gets a `Lead` and GA4 a
`generate_lead` from both forms.

## 3. Why Meta got no lead from GTM before

Until this change the site pushed **no** event to the `dataLayer` at all, so
the GTM Meta tag only ever sent PageView. Every `Lead` in Events Manager was
Meta guessing: the pixel's *automatic events* fire a `Lead` when a button
that reads like "quote" or "contact" submits a form holding an email or phone
field. That caught some car-buyer forms and could miss the dealer form, whose
contact fields sit on an earlier step.

Once the code is live, the guess and the real event would **both** fire, with
different event ids, so Meta would count one lead twice. Step 5 turns the
guess off.

## 4. Order of work

Do these in order: the GTM change stops the old click-based Google Ads trigger,
so publishing it before the code is live leaves a gap with no conversions.

1. **Database (each environment, before its deploy).** The build reads the
   new dealer ledger columns on every dealer-inquiry query.
   ```
   node --env-file=.env.local scripts/apply-dealer-conversion-columns.mjs dev --apply
   node --env-file=.env.local scripts/apply-dealer-conversion-columns.mjs staging --apply
   node --env-file=.env.local scripts/apply-dealer-conversion-columns.mjs production --apply
   ```
2. **Deploy** the code to production.
3. **GTM** — section 5.1 and 5.2, then publish.
4. **Meta** — section 5.3 (automatic events off, same day as step 3), then 5.4.
5. **Google Ads** — section 5.5, then add the two action ids to Railway.

## 5. Click-by-click

### 5.1 GTM: variables and triggers

At tagmanager.google.com → container **GTM-K7GCCZXQ** → Workspace:

1. **Variables** → *User-Defined Variables* → **New** → *Variable
   Configuration* → **Data Layer Variable**. Data Layer Variable Name:
   `lead_type`. Version 2. Save as `DLV - lead_type`.
2. Repeat for `lead_reference` → `DLV - lead_reference`, and `form_name` →
   `DLV - form_name`.
3. **Triggers** → **New** → *Trigger Configuration* → **Custom Event**.
   Event name: `generate_lead`. *This trigger fires on*: **Some Custom Events**
   → `DLV - lead_type` **equals** `car_buyer`. Save as
   `CE - generate_lead - car_buyer`.
4. Repeat with `dealer` → `CE - generate_lead - dealer`.

### 5.2 GTM: tags

**Google Ads car-buyer conversion — move it off the "Submit" click.**

1. **Tags** → open the *Google Ads Conversion Tracking* tag with Conversion
   Label `mocNCIzh5MUcEJ3tsqQ9`.
2. *Transaction ID*: `{{DLV - lead_reference}}` (stops a re-fire counting
   twice).
3. *Triggering*: remove the click trigger (Click Text equals `Submit` — it
   also counted submissions the server rejected) and add
   `CE - generate_lead - car_buyer`. Save.

**Google Ads dealer conversion — new tag.** First create the action in Google
Ads (5.5, step 1) to get its label, then:

1. **Tags** → **New** → *Google Ads Conversion Tracking*. Conversion ID
   `16450893469`, the new label, Transaction ID `{{DLV - lead_reference}}`.
2. Trigger `CE - generate_lead - dealer`. Save as
   `Google Ads - Dealer lead`.

**Meta pixel — add `lead_type` (so Meta can split dealers from car buyers).**

1. **Tags** → open the *Facebook Pixel* tag (the one whose event name is a
   variable and that fires on every custom event).
2. Expand **Object Properties** → **Add property**:
   - Property name `lead_type`, value `{{DLV - lead_type}}`
   - Property name `form_name`, value `{{DLV - form_name}}`
3. Save. On PageView and other events the variables are empty and nothing is
   added.

**Test and publish.** **Preview** → open `https://www.providenceauto.co.uk/b2b-inquiry`
in Tag Assistant. Submitting a real inquiry there creates a real lead and
emails the team, so do it with a test dealership name and set it to *Not a
fit* afterwards. Check that `generate_lead` appears with `lead_type: dealer`,
that the dealer Ads tag and the Facebook Pixel tag both fired, and that the
car-buyer Ads tag did not. Then **Submit** → *Publish*.

### 5.3 Meta: turn off the guessed Lead

Events Manager → **Datasets** → `providenceauto.co.uk` (1783158525559180) →
**Settings** → *Automatic events* → switch **off** "Track events automatically
without code". Leave *Automatic advanced matching* on.

Check after a day: **Overview** → `Lead` should now show roughly one event per
real lead, not two.

### 5.4 Meta: custom conversions

Events Manager → **Custom conversions** → **Create custom conversion**:

| Name | Data source | Event | Rule | Category |
| --- | --- | --- | --- | --- |
| Car buyer lead | providenceauto.co.uk | Lead | Custom data → `lead_type` equals `car_buyer` | Lead |
| Dealer lead | providenceauto.co.uk | Lead | Custom data → `lead_type` equals `dealer` | Lead |
| Dealer qualified | providenceauto.co.uk | QualifiedDealerLead | — | Lead |
| Dealer onboarded | providenceauto.co.uk | DealerOnboarded | — | Complete registration |

`QualifiedDealerLead` and `DealerOnboarded` only appear in the event list
after the first one arrives (the first inquiry set to Qualified / Onboarded
after the deploy). A custom conversion does not count events from before it
was created.

Dealer campaigns then optimise for **Dealer lead** (or Dealer qualified once
it has volume); car-buyer campaigns for **Car buyer lead**.

### 5.5 Google Ads: dealer conversion actions

ads.google.com → **Goals** → **Conversions** → **Summary** → **+ New
conversion action**:

1. **Website** → set up manually → category *Submit lead form*, name
   `Dealer lead (website)`. Copy the label for the GTM tag in 5.2.
2. **Import** → *CRMs, files or other data sources* → *Track conversions from
   clicks* → category *Qualified lead*, name `Dealer qualified`.
3. Same again → category *Converted lead*, name `Dealer onboarded`.
4. Open each imported action; the number after `ctId=` in the address bar is
   its id. On the Railway production service → **Variables**, set
   `GOOGLE_DEALER_QUALIFIED_ACTION_ID` and `GOOGLE_DEALER_ONBOARDED_ACTION_ID`.
   Until they are set, dealer stages go to Meta only.

Offline uploads also need the existing `GOOGLE_ADS_*` keys and a developer
token that is allowed to upload offline conversions (Google closed that to
tokens with no uploads between Dec 2025 and Jun 2026; if uploads fail with
`CUSTOMER_NOT_ALLOWLISTED_FOR_THIS_FEATURE`, that is the cause).

## 6. Leave alone

- `META_SEND_LEAD_ON_SUBMIT` stays **off**. The browser `Lead` from GTM is the
  raw lead; a server `Lead` from the app has a different event id and would
  double it.
- The Google Ads URL rule for `providenceauto.uk.com/thank-you` (configured in
  Google Ads, not GTM) points at the old domain and a page that does not
  exist, so it never fires. Remove it under Goals → Conversions if it is still
  listed as a primary action.
