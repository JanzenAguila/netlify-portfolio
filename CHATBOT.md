# Portfolio assistant

Add `OPENROUTER_API_KEY` privately to `.env.local` for local use and to Netlify's server environment for deployment. Restart/redeploy after changing settings. `.env.example` lists the settings; never put the key in a `NEXT_PUBLIC_` variable.

## Free endpoints only

The server reads OpenRouter's current model catalog before every visitor request. It accepts only model IDs ending in `:free` with explicitly zero prompt/completion pricing and zero in every other listed pricing field. An optional `OPENROUTER_FREE_MODEL` must pass the same checks. Without it, the server chooses a verified free model advertising JSON response support.

Both reply generation and the independent reply audit send zero `provider.max_price` values for prompt, completion, request, and image charges. Provider fallback is disabled. No model fallbacks, plugins, paid routes, retries, or BYOK are configured. If the catalog or free endpoint fails, the request stops. This is based on OpenRouter's published catalog and enforcement of its price controls; this application cannot control provider-side billing changes. A separate key with an account-level zero spending limit is useful defense in depth where supported; this project never changes your account settings.

Free endpoints have availability and quota limits. Each successful visitor question uses two free completions. Exhausting free quotas shows an unavailable message; the app never suggests purchasing credits or changes to a paid model.

## Profile scope and privacy

The server includes selected fields from experience, non-placeholder projects, education, professional contact links, and `components/JSONFiles/ChatProfile.json`. The older About file is deliberately excluded because its current-employer statement conflicts with newer experience records. Edit the supplement to update career direction, learning style, and opportunity preferences. Rebuild to apply profile changes.

The model generates a scoped draft; a separate model call audits it against the approved profile before release. Unknown facts and rejected drafts receive a fixed safe response. This reduces off-topic answers and fabrication but is not a mathematical guarantee against model errors or prompt injection. Review real-model behavior before launch, including mixed questions, fabricated facts in chat history, salary questions, job-fit assessments, general React tutorials, and “ignore your instructions” attacks.

Conversations stay in browser memory until reload or clear; closing the panel retains the conversation. Only the latest five exchanges are sent with the next question. The app does not store or log chat contents. OpenRouter and its providers receive the approved context and conversation; their retention policies still apply. The UI renders replies as plain text, never HTML.

Requests have bounded message counts and sizes, finite timeouts, and a best-effort in-memory limiter (five requests per minute per server-observed address). On serverless hosting, addresses may be shared and counters are per instance, not durable global abuse protection. For a busy public deployment, add host-level rate limiting. No database or extra paid service is required by this implementation.

## Verification

Run `node --test lib/profile-chat.test.cjs` and `npm run build`. Mocked tests verify pricing checks, prohibited fallback, conversation validation, and audit rejection. They do not measure the behavior of a real model. An actual server-side key is required for live inference verification.

Routing reference: https://openrouter.ai/docs/guides/routing/provider-selection#max-price
