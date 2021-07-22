require('dotenv').config()
const Telegraf = require('telegraf')
const session = require('telegraf/session')
const fetch = require('node-fetch')

const bot = new Telegraf(process.env.TELEGRAF_TOKEN)
bot.use(session())
const serverURL = process.env.SERVER_URL

const healthCheck = async (ctx) => {
  try {
    const resp = await fetch(`${serverURL}/status`)
    ctx.reply(`☀️☀️ server ${serverURL} alive ☀️☀️`)
  } catch {
    ctx.reply('☠️☠️ server dead ☠️☠️')
  }
}

const intervalHealthCheck = async () => {
  try {
    const resp = await fetch(`${serverURL}/status`)
  } catch {
    bot.telegram.sendMessage(process.env.CHAT_ID, process.env.DEV_MENTION)
    bot.telegram.sendMessage(
      process.env.CHAT_ID,
      '☠️☠️☠️☠️ server dead alert ☠️☠️☠️☠️',
    )
    bot.telegram.sendMessage(process.env.CHAT_ID, `${serverURL}`)
  }
}

setInterval(() => {
  intervalHealthCheck()
}, 60000)

bot.start(async (ctx) => {
  healthCheck(ctx)
})

bot.command('mochistatus', async (ctx) => {
  healthCheck(ctx)
})

bot.startPolling() //MUST HAVE
