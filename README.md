````md
# hooligan

an iMessage-native AI sidekick for deciding what to do, where to go, and how to spend your time.

no apps. no UI. just text.

## what is hooligan?

hooligan is a conversational agent you text like a friend.

you send:
- “i have 2 hours”
- “coffee + views”
- “planning a trip”

it:
- asks follow-up questions
- understands your vibe
- suggests plans
- avoids repeating the same recommendations
- learns from what you like

it can also proactively message you during the day.

---

## how it works

- runs on the Photon iMessage SDK  
- listens to incoming messages  
- maintains lightweight user state  
- generates responses using OpenAI  
- stores simple memory (visited / liked)

everything happens inside iMessage.


## setup

### 1. clone

```bash
git clone https://github.com/your-username/hooligan.git
cd hooligan
````

### 2. install

```bash
npm install
```

### 3. create `.env`

in the root directory:

```
.env
```

add:

```bash
OPENAI_API_KEY=your_openai_api_key
MY_NUMBER=+1XXXXXXXXXX
```

notes:

* include country code in your phone number
* never commit `.env`

### 4. run

```bash
npx tsx hooligan-agent.ts
```

## usage

start the agent, then text it.

example flow:

```
you: hey
hooligan: hey where are you rn 👀

you: honolulu
hooligan: what are we feeling today
         chill / coffee / outdoors / chaotic / aesthetic

you: coffee + views
hooligan: how much time + budget?

you: 2 hours
hooligan: [suggests a plan]
```


## features

* conversational planning (no UI)
* short, human-like responses
* multi-step interaction flow
* simple memory (visited + liked)
* avoids repeating suggestions
* proactive nudges (morning + midday)


## memory

hooligan stores:

* places you’ve tried
* what you liked

example:

```
you: i loved that place
```

this improves future recommendations.

data is stored locally in `memory.json`.


## proactive messages

configured via Photon reminders:

* 9am → morning check-in
* 2pm → midday suggestion

you can change these in the code.

## stack

* Photon iMessage SDK
* OpenAI API
* TypeScript
* Node.js

## one-line pitch

hooligan is a text-first life sidekick that helps you decide what to do right inside iMessage.


## notes

this is an experimental build exploring conversational, ambient AI.

the focus is on:

* natural interaction
* minimal interface
* personal utility