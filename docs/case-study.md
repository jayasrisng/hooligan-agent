# Hooligan Case Study

## Summary

Hooligan is an iMessage-native planning agent. It helps a user decide what to do with free time through short text conversations, lightweight local memory, and scheduled nudges.

The project explores ambient AI as a messaging-native utility rather than a standalone app.

## Problem

Small planning decisions create surprising friction. A person may want coffee, a walk, a spontaneous outing, or a trip idea, but the decision often requires switching between search, maps, saved posts, notes, and group chats.

The project asks:

> Can an assistant reduce planning friction by living inside the messaging surface people already use?

## Approach

Hooligan keeps the interface minimal:

1. The user texts a short intent.
2. The agent asks only for missing constraints.
3. Local memory provides lightweight preference context.
4. OpenAI generates a concise suggestion.
5. Photon sends the reply through iMessage.
6. Scheduled reminders can prompt the user at useful times.

## Technical stack

- TypeScript
- Node.js
- Photon iMessage SDK
- OpenAI API
- Local JSON memory
- dotenv configuration

## Design decisions

### No custom UI

The project intentionally avoids building another app surface. The point is to test whether planning can happen naturally through text.

### Keep responses short

The agent is designed to feel like a friend texting, not a long-form itinerary generator.

### Start with local memory

A local `memory.json` file is enough to test repeated suggestions and preference learning without introducing premature database complexity.

## Challenges

### Personal context is sensitive

Location, preferences, plans, and routines are private. Future versions need explicit controls for memory, proactive messages, and deletion.

### Proactive messaging can become annoying

Scheduled nudges need opt-in behavior and clear user control.

### Messaging agents need guardrails

The agent should avoid overconfident recommendations, unsafe plans, or exposing private context in logs.

## What this demonstrates

- Messaging-native AI interaction design.
- Lightweight agent memory.
- OpenAI integration in a real communication surface.
- Product thinking around ambient assistants and proactive utility.

## Future work

- Add memory schema validation.
- Add opt-in reminder configuration.
- Add a dry-run demo mode.
- Add tests around memory updates and repeated recommendation avoidance.
- Add safer location and schedule handling.
