require('dotenv').config();
const { Telegraf } = require('telegraf');
const http = require('http');

// Initialize the Telegram Bot using your BotFather token
const bot = new Telegraf(process.env.BOT_TOKEN);

// Welcome message when someone types /start
bot.start((ctx) => {
    ctx.reply(
        "🚀 **Welcome to ContentBot!** Your instant marketing assistant.\n\n" +
        "Use these commands to generate content structures instantly:\n\n" +
        "📝 /blog [topic] - Create an SEO blog post outline\n" +
        "📱 /social [topic] - Create a high-converting social media post\n" +
        "🔄 /rewrite [text] - Polish and format your text layout",
        { parse_mode: 'Markdown' }
    );
});

// Command: Generate a Blog Outline (Template Engine)
bot.command('blog', (ctx) => {
    const topic = ctx.message.text.replace('/blog', '').trim();
    if (!topic) return ctx.reply("❌ Please provide a topic! Example: `/blog fitness tips`", { parse_mode: 'Markdown' });

    const outline = `📝 **SEO Blog Outline for:** ${topic}\n\n` +
        `🔹 **1. Introduction**\n` +
        `   • Hook: Why ${topic} matters right now.\n` +
        `   • Core problem & thesis statement.\n\n` +
        `🔹 **2. Main Body Section 1: The Foundation**\n` +
        `   • Understanding the critical basics of ${topic}.\n` +
        `   • Top 3 common mistakes beginners make.\n\n` +
        `🔹 **3. Main Body Section 2: Actionable Steps**\n` +
        `   • Step-by-step guide to mastering ${topic}.\n` +
        `   • Real-world examples and practical strategies.\n\n` +
        `🔹 **4. Main Body Section 3: Advanced Frameworks**\n` +
        `   • Industry secrets and the future outlook of ${topic}.\n\n` +
        `🔹 **5. Conclusion & Next Steps**\n` +
        `   • Summary of key takeaways.\n` +
        `   • Call to action: Prompt readers to comment and share.`;
    
    ctx.reply(outline, { parse_mode: 'Markdown' });
});

// Command: Generate Social Media Copy (AIDA Framework)
bot.command('social', (ctx) => {
    const input = ctx.message.text.replace('/social', '').trim();
    if (!input) return ctx.reply("❌ Please provide a topic! Example: `/social a new clothing brand`", { parse_mode: 'Markdown' });

    // Clean up spaces to make a valid hashtag
    const hashtag = input.replace(/\s+/g, '');

    const post = `📱 **Social Media Post Builder**\n\n` +
        `🚨 **ATTENTION:** Stop scrolling! If you are trying to win at **${input}**, you need to hear this.\n\n` +
        `💡 **INTEREST:** Most people struggle with this because they use the wrong strategies. But mastering ${input} doesn't have to be complicated.\n\n` +
        `✨ **DESIRE:** Imagine saving hours of time, getting ahead of the competition, and achieving real results starting today.\n\n` +
        `✅ **ACTION:** Click the link in our bio or drop a comment below to claim your free guide! \n\n` +
        `#${hashtag} #marketing #business #success #trending`;

    ctx.reply(post, { parse_mode: 'Markdown' });
});

// Command: Rewrite / Format Text
bot.command('rewrite', (ctx) => {
    const text = ctx.message.text.replace('/rewrite', '').trim();
    if (!text) return ctx.reply("❌ Please provide text to rewrite! Example: `/rewrite i love coding`", { parse_mode: 'Markdown' });

    const formattedText = `🔄 **Polished & Formatted Content:**\n\n` +
        `✨ *"${text.charAt(0).toUpperCase() + text.slice(1)}"* \n\n` +
        `💡 *Optimized for clarity, audience engagement, and professional presentation.*`;

    ctx.reply(formattedText, { parse_mode: 'Markdown' });
});

// Launch the Telegram bot
bot.launch().then(() => console.log("ContentBot Engine is active!"));

// Render Keep-Alive Server
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('ContentBot Web Server Online!');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

process.once('SIGINT', () => { bot.stop('SIGINT'); server.close(); });
process.once('SIGTERM', () => { bot.stop('SIGTERM'); server.close(); });
