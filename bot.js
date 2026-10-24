const express = require("express")
const app = express()
app.get("/", (req,res) => res.send("PTD KING BOT ONLINE ✅"))
app.listen(3000, () => console.log("Web ON"))

const { default: makeWASocket, useMultiFileAuthState, downloadMediaMessage } = require("@whiskeysockets/baileys")
const P = require("pino")
async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('session')
    const sock = makeWASocket({ logger: P({ level: "silent" }), auth: state, printQRInTerminal: true })
    sock.ev.on('creds.update', saveCreds)
    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0]
        if (!msg.message) return
        if (msg.message.viewOnceMessage || msg.message.viewOnceMessageV2) {
            try {
                const buffer = await downloadMediaMessage(msg, 'buffer', {}, { logger: P() })
                await sock.sendMessage(msg.key.remoteJid, { image: buffer, caption: "✅ Saved by PTD KING BOT" })
            } catch {}
        }
    })
}
startBot()
