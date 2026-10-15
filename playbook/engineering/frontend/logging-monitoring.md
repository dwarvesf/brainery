---
title: Logging and monitoring
description: What to track in a frontend app, from error tracing to loading time, interactivity, visual stability and events.
date: 2026-10-15
redirect:
  - /CidQXQ
---

This document provides guidance on some key metrics to track when logging and monitoring a frontend application.

## Errors tracing

Frontend applications receive a lot of user interactions and unexpected errors can arise quickly. To help developers catch and resolve these errors easily, we need a tool can:

- [x] Integrate to the staging and dev environments in order to catch any new issues before they become production bugs.
- [x] Group similar error events together in one table so we can locate and resolve the errors more quickly.
- [x] Make sure application errors can be identified by the times at which they occur, as well as which users were affected.
- [x] Prioritize error reports based on impact so that we can focus attention on the errors most likely to be happening.
- [x] Notify responsible developers as soon as possible when production issues arise so they can take immediate action.
- [x] Link errors to management tools to prevent missing these errors.
- [x] Ensure that issues are updated with current statuses.

In light of these criteria, we chose [Sentry](https://sentry.io/) as the platform with which to monitor issues happening on our client side.

Minimal Sentry setup for a browser app (in Next.js use `@sentry/nextjs`):

```js
import * as Sentry from "@sentry/browser";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_APP_ENV, // dev, staging, production
  release: process.env.NEXT_PUBLIC_RELEASE, // lets Sentry link errors to a deploy
});

Sentry.setUser({ id: user.id }); // user from your auth context; identify who was affected, without email or name
```

## Performance

To provide users with the best experience, it is important to know how good your application is. The [performance insights](https://developer.chrome.com/docs/devtools/performance-insights/) feature of DevTools allows you to measure which areas of your application are performing well and where improvements can be made.

1. **Loading time:** the main content should load quickly.
2. **Interactivity:** how much time it takes to respond when users interact with our application.
3. **Visual stability:** the content must be visually stable and without unexpected changes in layout.

These map to Google's Core Web Vitals, the metrics PageSpeed Insights and Lighthouse report:

| Aspect           | Core Web Vital                  | Commonly cited "good" threshold |
| ---------------- | ------------------------------- | ------------------------------- |
| Loading time     | Largest Contentful Paint (LCP)  | 2.5 s or less                   |
| Interactivity    | Interaction to Next Paint (INP) | 200 ms or less                  |
| Visual stability | Cumulative Layout Shift (CLS)   | 0.1 or less                     |

Thresholds are Google's published guidance and can change, so confirm them on [web.dev](https://web.dev/vitals/). INP replaced First Input Delay (FID) in March 2024.

### Loading time

If your application is compatible with SEO engines, you can check its [PageSpeed Insight](https://pagespeed.web.dev/) scores on the Google Developers website. This will show you all of your application's metric scores for each page URL and how to improve it so that you can improve it metric by metric.

If a site is using authentication, PageSpeed Insights will be unable to check it. We need to use [Lighthouse Google Extension](https://chrome.google.com/webstore/detail/lighthouse/blipmdconlkpinefehnmjammfjpmpbjk) to check for the same metrics as PageSpeed Insight.

To track all page loading time, we should install tracking code to your application like [Google Analytics](https://analytics.google.com/) and [Mix Panel](https://mixpanel.com/). These tools can generate detailed reports that help us understand and improve our application.

### Interactivity

Lighthouse helps you improve the start-up performance of your website by identifying optimization opportunities. You can find details on this [document](https://web.dev/bootup-time/) to help you identify and fix the issues that slow down your site.

In addition, We use [Webpack Bundle Analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer) to identify which code bundles are large and need to be optimized with code splitting or a reduction in third-party modules. Tools such as [BundlePhobia](https://bundlephobia.com/) are used to compare or find alias packages in order to reduce the bundle size.

### Visual stability

This metric will be difficult to monitor and maintain because there are many different device sizes and browser engines in use today. To address this problem we must follow responsive design standards and use automation tools that check on multiple devices, reporting their results back to us.

We recommend using [BrowserStack](https://www.browserstack.com/) to run automated testing in CI/CD, and sending us a report after any releases.

### Event and data flow tracking

We use [Google Analytics](https://analytics.google.com/) on our projects by default to log important user interactions. In addition, custom events can be set for specific goals based on Marketing team requirements.

Based on analytic data, we can identify which page needs to be improved to decrease bounce rate and fix broken links.

## Release checklist

- [ ] Error tracking is on in staging and production, with the release version attached.
- [ ] Lighthouse or PageSpeed scores for the key pages are recorded before and after the release.
- [ ] Bundle size is checked against the last release.
- [ ] Analytics events for the new feature are defined with the Marketing team and verified in a test session.
- [ ] Someone is named to watch the error dashboard after deploy.

## Read on

- [Tech ecosystem](tech-ecosystem.md)
- [Code style](code-style.md)
- [Writting test](writing-test.md)
- [UI checklist](ui-checklist.md)
