# Microsoft Clarity

Project: Supreme Trucking Insurance (`ylmsga6k9j`).
Owner access: https://clarity.microsoft.com/projects/view/ylmsga6k9j/settings#setup

In Clarity, open Heatmaps to review clicks and scrolling after eligible traffic
arrives. Installation detection and reports can take up to two hours. This is
not a count of all visitors or completed insurance requests.

## Privacy boundaries

- Separate, versioned, opt-in consent; existing Google Analytics consent does not authorize Clarity.
- Global Privacy Control and Do Not Track override permission.
- Production domain only, with an explicit list of reviewed public landing pages.
- No query strings, fragments, or potentially private referrer paths.
- No quote, application, contact, upload, admin or account pages.
- Text masked in server-rendered markup as well as the project's Strict setting.
- Recording ends before chat, text-field interaction or link/SPA navigation and never restarts in the same document.
- A guarded vendor queue prevents late script downloads from starting after withdrawal or navigation.
- No custom identity values, form values or advertising storage permission.
- Clarity cookies default to Off in the project. Site permission is sent through Consent V2 only after opt-in.
- Declining stops collection and clears first-party Clarity cookies. Previously uploaded data is not erased by withdrawal.

This deliberately records public landing-page interactions, not complete
multi-page customer journeys. Do not paste the unconditional tracking snippet
into another layout, a tag manager, or the application iframe. Do not add
unmasking rules without a privacy review. No additional team/API access was created.
