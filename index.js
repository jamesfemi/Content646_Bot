require('dotenv').config();
const { Telegraf } = require('telegraf');
const { OpenAI } = require('openai');
const http = require('http');

// 1. Initialize Bots and APIs
const bot = new Telegraf(process.env.BOT_TOKEN);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Welcome message
bot.start((ctx) => {
    ctx.reply(
        "🚀 **Welcome to ContentBot!** Your AI copywriter.\n\n" +
        "Use these commands to generate high-quality marketing content:\n\n" +
        "📝 /blog [topic] - Generate a structured blog post outline\n" +
        "📱 /social [product/topic] - Write a high-converting social media post\n" +
        "🔄 /rewrite [text] - Rewrite your text to sound human and engaging",
        { parse_mode: 'Markdown' }
    );
});

// Command: Generate a Blog Outline
bot.command('blog', async (ctx) => {
    const topic = ctx.message.text.replace('/blog', '').trim();
    if (!topic) return ctx.reply("❌ Please provide a topic! Example: `/blog artificial intelligence in 2026`", { parse_mode: 'Markdown' });

    ctx.reply("✍️ Brainstorming your blog structure... please wait.");
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are an expert SEO content strategist. Create a highly structured blog post outline including an Introduction focus, 3-4 distinct main sections with sub-bullet points, and a Conclusion focus." },
                { role: "user", content: `Create a blog outline for the topic: ${topic}` }
            ]
        });
        ctx.reply(response.choices[0].message.content);
    } catch (error) {
        console.error(error);
        ctx.reply("⚠️ Sorry, I ran into an error connecting to the AI. Check your OpenAI key.");
    }
});

// Command: Generate Social Media Copy
bot.command('social', async (ctx) => {
    const input = ctx.message.text.replace('/social', '').trim();
    if (!input) return ctx.reply("❌ Please provide a product or theme! Example: `/social an eco-friendly water bottle`", { parse_mode: 'Markdown' });

    ctx.reply("📱 Drafting your social media post...");
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a professional social media manager. Write an engaging, high-converting social media post using the AIDA framework (Attention, Interest, Desire, Action). Include relevant emojis and popular hashtags." },
                { role: "user", content: `Write a social post for: ${input}` }
            ]
        });
        ctx.reply(response.choices[0].message.content);
    } catch (error) {
        console.error(error);
        ctx.reply("⚠️ Error generating copy.");
    }
});

// Command: Rewrite / Humanize Text
bot.command('rewrite', async (ctx) => {
    const textToRewrite = ctx.message.text.replace('/rewrite', '').trim();
    if (!textToRewrite) return ctx.reply("❌ Please provide text to rewrite! Example: `/rewrite artificial intelligence is changing jobs fast`", { parse_mode: 'Markdown' });

    ctx.reply("🔄 Rephrasing your content...");
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are an expert editor. Rewrite the user's text to make it sound entirely natural, professional, and engaging while keeping the original meaning intact." },
                { role: "user", content: `Rewrite this: ${textToRewrite}` }
            ]
        });
        ctx.reply(response.choices[0].message.content);
    } catch (error) {
        console.error(error);
        ctx.reply("⚠️ Error rephrasing text.");
    }
});

// Start Telegram Bot Listener
bot.launch().then(() => console.log("ContentBot listening on Telegram!"));

// 2. Render Keep-Alive Server
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('ContentBot Server is Online!');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Health check listening on port ${PORT}`));

process.once('SIGINT', () => { bot.stop('SIGINT'); server.close(); });
process.once('SIGTERM', () => { bot.stop('SIGTERM'); server.close(); });
