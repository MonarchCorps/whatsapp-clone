import {
    GoogleGenerativeAI,
    HarmBlockThreshold,
    HarmCategory,
} from '@google/generative-ai'
import { action } from './_generated/server'
import { v } from 'convex/values'
import { api } from './_generated/api'

// Deep Ai text to image generation
const safetySettings = [
    {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
];

const genAI = new GoogleGenerativeAI(process.env.GEMINI_PUBLIC_KEY!);
const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    safetySettings: safetySettings,
});


const aiChat = model.startChat({
    history: [
        {
            role: 'user',
            parts: [{
                text: 'Hello'
            }]
        }, {
            role: 'model',
            parts: [{
                text: 'Summarize your response in one short sentence: "What is the capital of France?"'
            }]
        }
    ]
})

export const chats = action({
    args: {
        messageBody: v.string(),
        conversation: v.id('conversations')
    },
    handler: async (ctx, args) => {
        const result = await aiChat.sendMessage(args.messageBody)
        const messageContent = result.response.text()

        await ctx.runMutation(api.messages.sendGeminiMessage, {
            content: messageContent ?? 'I\'m sorry i don\' have a response for that',
            conversation: args.conversation,
            messageType: 'text'
        })
    }
})