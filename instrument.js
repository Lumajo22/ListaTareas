const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "https://f4742e94a0cf151ecfb65d81908e7cda@o4511368940224512.ingest.de.sentry.io/4511368947171408",
  sendDefaultPii: true,
});