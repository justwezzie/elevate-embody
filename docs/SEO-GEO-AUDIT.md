# SEO and GEO Audit

Date: April 10, 2026
Project: Elevate + Embody
Workspace: `/Users/wezziembale/LisasYoga`

## Purpose

This document summarizes the current SEO and GEO (Generative Engine Optimization) position of the Elevate + Embody website after the recent implementation work.

This is primarily a codebase and implementation audit. It evaluates what the site is technically exposing to search engines, AI-powered answer engines, and social/link preview systems.

## Executive Summary

The site is now in a strong position technically for both SEO and GEO.

Current assessment:

- SEO: 8.5/10
- GEO: 9/10

Compared with the original state, the site now has:

- server-rendered public session detail pages
- route-level metadata on core public pages
- sitemap and robots support
- structured data for business, FAQ, events, offers, breadcrumbs, and session listings
- dedicated FAQ content
- stronger factual copy for AI/search summarization
- IndexNow support for faster discovery of changed session URLs
- branded Open Graph and Twitter preview images

The remaining work is mostly polish, monitoring, and optional expansion rather than foundational fixes.

## Business Facts Now Reflected On-Site

The public site now clearly communicates these business facts:

- Business name: Elevate + Embody
- Location: Staffordshire
- Services: group and 1 to 1 yoga and boxing sessions
- Availability: upcoming sessions are published on the website
- Instructor: Lisa, a qualified yoga, fitness and wellness coach
- Pricing: affordable, under £15 per session
- Booking method: sessions can be booked directly through the website

These facts are now present in metadata, structured data, on-page copy, FAQ content, and/or session detail content.

## What Was Implemented

### 1. Public Metadata

Sitewide metadata is defined in:

- `/Users/wezziembale/LisasYoga/app/layout.tsx`

This includes:

- `metadataBase`
- title templating
- root description
- canonical root
- base Open Graph metadata
- base Twitter metadata

Page-level metadata is now defined for:

- homepage: `/Users/wezziembale/LisasYoga/app/page.tsx`
- sessions index: `/Users/wezziembale/LisasYoga/app/(public)/sessions/page.tsx`
- session detail: `/Users/wezziembale/LisasYoga/app/(public)/sessions/[id]/page.tsx`
- FAQ page: `/Users/wezziembale/LisasYoga/app/(public)/faq/page.tsx`

### 2. Server-Rendered Public Session Pages

The session detail page was converted into a server-rendered route:

- `/Users/wezziembale/LisasYoga/app/(public)/sessions/[id]/page.tsx`

This means:

- class details are available in the initial HTML
- search engines can index each session more reliably
- metadata can be generated per class
- structured data can be emitted per class

Interactive booking behavior was preserved through:

- `/Users/wezziembale/LisasYoga/components/sessions/SessionBookingButton.tsx`

Shared session retrieval logic was centralized in:

- `/Users/wezziembale/LisasYoga/lib/public-sessions.ts`

### 3. Sitemap and Robots

Implemented:

- sitemap: `/Users/wezziembale/LisasYoga/app/sitemap.ts`
- robots: `/Users/wezziembale/LisasYoga/app/robots.ts`

Current robots behavior:

- allows public crawling
- disallows admin, dashboard, auth, and API routes
- points crawlers to the generated sitemap

### 4. Structured Data

The site now exposes multiple schema types.

Homepage:

- `LocalBusiness`
- FAQ schema
- service list schema

File:

- `/Users/wezziembale/LisasYoga/app/page.tsx`

Sessions index:

- `ItemList`
- embedded event-style objects for listed sessions

File:

- `/Users/wezziembale/LisasYoga/app/(public)/sessions/page.tsx`

Session detail page:

- `Event`
- `Offer`
- `BreadcrumbList`
- page-specific `FAQPage`

File:

- `/Users/wezziembale/LisasYoga/app/(public)/sessions/[id]/page.tsx`

FAQ page:

- `FAQPage`
- `BreadcrumbList`

File:

- `/Users/wezziembale/LisasYoga/app/(public)/faq/page.tsx`

### 5. Noindex for Utility Areas

The site now prevents indexing of private/utility surfaces:

- auth routes: `/Users/wezziembale/LisasYoga/app/(auth)/layout.tsx`
- client routes: `/Users/wezziembale/LisasYoga/app/(client)/layout.tsx`
- admin routes: `/Users/wezziembale/LisasYoga/app/(admin)/layout.tsx`

This protects search quality by keeping non-public pages out of the index.

### 6. Open Graph and Twitter Preview Images

Branded preview image routes now exist:

- `/Users/wezziembale/LisasYoga/app/opengraph-image.tsx`
- `/Users/wezziembale/LisasYoga/app/twitter-image.tsx`

These improve how shared links appear in messaging apps, social platforms, and other preview surfaces.

### 7. IndexNow

IndexNow support has been implemented.

Files:

- `/Users/wezziembale/LisasYoga/lib/indexnow.ts`
- `/Users/wezziembale/LisasYoga/app/indexnow-key.txt/route.ts`
- `/Users/wezziembale/LisasYoga/app/api/admin/sessions/route.ts`
- `/Users/wezziembale/LisasYoga/app/api/admin/sessions/[id]/route.ts`

Behavior:

- when a session is created, updated, or deleted in admin
- the homepage, sessions index, and relevant session page are submitted to IndexNow

Required environment variable:

- `INDEXNOW_KEY`

### 8. Homepage and GEO Content Improvements

The homepage now carries stronger factual and machine-readable context.

Updated signals include:

- based in Staffordshire
- group and 1 to 1 yoga and boxing sessions
- Lisa as the teacher
- direct online booking
- affordable classes under £15

The homepage FAQ and hero content now support GEO by answering clear user questions instead of relying only on brand-style copy.

File:

- `/Users/wezziembale/LisasYoga/app/page.tsx`

### 9. FAQ Content

A dedicated FAQ page now exists:

- `/Users/wezziembale/LisasYoga/app/(public)/faq/page.tsx`

It covers:

- booking
- cancellations/rescheduling
- what to bring
- location
- who teaches the sessions
- what classes/services are offered
- pricing
- beginner suitability

It also includes:

- accordions
- pink-accent styling consistent with the homepage
- a `Book Sessions` CTA

## GEO Assessment

### What GEO Means Here

For this site, GEO means making the site easy for AI-powered systems and answer engines to:

- identify the business
- understand what is offered
- extract trustworthy facts
- summarize booking details accurately
- connect classes, instructor, pricing, and location without guessing

### GEO Strengths

The site now performs well on key GEO signals:

- business identity is explicit
- location is explicit
- services are explicit
- instructor identity is explicit
- booking path is explicit
- price expectations are explicit
- questions are answered in FAQ form
- session pages provide structured event data
- pages are readable in answer-style blocks, not just marketing prose

### GEO Risks Still Remaining

These are not major blockers, but they are areas to keep improving over time:

1. The homepage “Why Elevate + Embody?” section is still somewhat brand-oriented rather than purely factual.

2. Some copy still uses “upcoming” or “soon” language without giving a broader explanation of schedule rhythm beyond what is shown in the actual published sessions.

3. Business location is stated as Staffordshire, but there is not yet a more precise studio/location page. If the business settles on a stable venue or repeated area wording, that could be expanded later.

4. There is no dedicated About page yet. Lisa’s profile exists on the homepage and within session content, but a richer About page could strengthen both trust and GEO.

## SEO Assessment

### SEO Strengths

The site now has strong foundational SEO implementation:

- crawlable public routes
- canonical metadata
- server-rendered session details
- sitemap
- robots
- noindex for non-public pages
- Open Graph and Twitter preview images
- structured data
- internal links to FAQ and sessions
- good mobile-friendly tap targets

### SEO Risks Still Remaining

Remaining issues are relatively minor:

1. There is still room to make the homepage and sessions titles even more search-intent specific if needed.

2. The site could benefit from a more deliberate long-form About page or Classes page targeting broader non-branded search queries.

3. Search Console / Bing Webmaster validation has not been covered in code, so live monitoring still needs to happen externally.

## Page-by-Page Snapshot

### Homepage

File:

- `/Users/wezziembale/LisasYoga/app/page.tsx`

Current status:

- strong metadata
- `LocalBusiness` schema
- FAQ schema
- service/entity support
- factual hero copy
- centered accordion FAQ
- internal CTA to sessions

### Sessions Index

File:

- `/Users/wezziembale/LisasYoga/app/(public)/sessions/page.tsx`

Current status:

- route-level metadata
- `ItemList` schema
- stronger Staffordshire/Lisa/pricing copy
- accordion support content
- clear filtering

### Session Detail

File:

- `/Users/wezziembale/LisasYoga/app/(public)/sessions/[id]/page.tsx`

Current status:

- server-rendered
- dynamic metadata
- `Event` + `Offer`
- breadcrumbs
- FAQ schema
- consistent accordions
- booking CTA

### FAQ Page

File:

- `/Users/wezziembale/LisasYoga/app/(public)/faq/page.tsx`

Current status:

- dedicated FAQ route
- FAQ schema
- breadcrumb schema
- styled accordions
- `Book Sessions` CTA

## Recommended Next Steps

These are now optional enhancements rather than critical fixes.

### Short-Term

1. Add a dedicated About page for Lisa and the business.
2. Add a dedicated Classes page if you want a broader evergreen page targeting yoga/boxing intent outside individual sessions.
3. Add richer local wording if you settle on a regular venue or repeated class locations.

### Operational

1. Set up Google Search Console.
2. Set up Bing Webmaster Tools.
3. Verify the sitemap.
4. Verify robots behavior.
5. Set the `INDEXNOW_KEY` in production if it is not already configured.

### Content

1. Keep session titles specific and descriptive.
2. Keep session descriptions explicit about audience, style, and expectations.
3. Keep FAQ wording updated as booking rules evolve.

## Environment and Verification Notes

Important production envs relevant to SEO/GEO:

- `NEXT_PUBLIC_APP_URL`
- `INDEXNOW_KEY`

Other supporting envs already used by the app:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Final Verdict

The site now has strong technical SEO and strong GEO foundations.

It is no longer missing the major public-search essentials. The biggest gains now will come from:

- ongoing content quality
- monitoring
- possible expansion into About/classes/location-specific evergreen pages

In short:

- SEO foundation: strong
- GEO readiness: strong
- remaining work: refinement, not rescue
