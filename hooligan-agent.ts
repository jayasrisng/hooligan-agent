import { IMessageSDK, Reminders } from '@photon-ai/imessage-kit'
import OpenAI from 'openai'
import fs from 'fs'
import path from 'path'
import 'dotenv/config'

const sdk = new IMessageSDK()
const reminders = new Reminders(sdk)

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

// -------- MEMORY --------
const memoryPath = path.join(process.cwd(), 'memory.json')

if (!fs.existsSync(memoryPath)) {
  fs.writeFileSync(memoryPath, JSON.stringify({ users: {} }, null, 2))
}

function loadMemory() {
  return JSON.parse(fs.readFileSync(memoryPath, 'utf-8'))
}

function saveMemory(data: any) {
  fs.writeFileSync(memoryPath, JSON.stringify(data, null, 2))
}

function getUser(memory: any, sender: string) {
  if (!memory.users[sender]) {
    memory.users[sender] = {
      visited: [],
      liked: []
    }
  }
  return memory.users[sender]
}

// -------- STATE --------
let state: Record<string, any> = {}

// -------- OPENAI --------
async function hooliganReply(message: string, context: string) {
  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `
you are hooligan, a playful but smart life sidekick.

tone:
- casual, human, slightly chaotic but clear
- like texting a fun friend

behavior:
- ask questions if info is missing
- suggest plans when ready
- avoid repeating same places
- use memory preferences

format:
- short messages
- no paragraphs
- feels like texting
`
      },
      {
        role: "user",
        content: `
user message: ${message}

context: ${context}
`
      }
    ]
  })

  return res.choices[0].message.content || "say less, go outside 😭"
}

// -------- MAIN AGENT --------
await sdk.startWatching({
  onDirectMessage: async (msg): Promise<void> => {
    const text = msg.text?.toLowerCase() || ""
    const sender = msg.sender

    // allow self testing (remove later if needed)
    // if (msg.isFromMe) return

    const memory = loadMemory()
    const user = getUser(memory, sender)

    if (!state[sender]) {
      state[sender] = { step: 0, data: {} }
    }

    const userState = state[sender]

    // --- detect travel mode ---
    let extraContext = ""
    if (text.includes("trip") || text.includes("vacation")) {
      extraContext = "user is planning a trip, ask destination, duration, budget"
    }

    // --- feedback learning ---
    if (text.includes("love") || text.includes("liked")) {
      user.liked.push("recent suggestion")
      saveMemory(memory)
      await sdk.send(sender, "ok bet, i’ll remember that 😌")
      return
    }

    // --- conversation flow ---
    if (userState.step === 0) {
      userState.step = 1
      await sdk.send(sender, "hey where are you rn 👀")
      return
    }

    if (userState.step === 1) {
      userState.data.location = text
      userState.step = 2
      await sdk.send(
        sender,
        "what are we feeling today\nchill / coffee / outdoors / chaotic / aesthetic"
      )
      return
    }

    if (userState.step === 2) {
      userState.data.vibe = text
      userState.step = 3
      await sdk.send(sender, "how much time + budget?")
      return
    }

    if (userState.step === 3) {
      userState.data.constraints = text

      const context = `
location: ${userState.data.location}
vibe: ${userState.data.vibe}
constraints: ${userState.data.constraints}
visited: ${user.visited.join(", ") || "none"}
liked: ${user.liked.join(", ") || "none"}
${extraContext}
`

      const reply = await hooliganReply("plan something", context)

      // store memory
      user.visited.push(`plan in ${userState.data.location}`)
      saveMemory(memory)

      // reset state
      state[sender] = { step: 0, data: {} }

      await sdk.send(sender, reply + "\n\ndid you like this? i’ll remember 👀")
      return
    }
  }
})

// -------- PROACTIVE MESSAGES --------

// 🌅 morning nudge
reminders.at("9am", process.env.MY_NUMBER!, async (_ctx) => {
  const msg = await hooliganReply(
    "morning message",
    "send a friendly good morning message asking about their vibe today"
  )

  await sdk.send(process.env.MY_NUMBER!, msg)
})

// ☀️ midday nudge
reminders.at("2pm", process.env.MY_NUMBER!, async (_ctx) => {
  const msg = await hooliganReply(
    "midday message",
    "it's afternoon, suggest something fun like coffee, ice cream, or stepping out"
  )

  await sdk.send(process.env.MY_NUMBER!, msg)
})