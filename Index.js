const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys')
const P = require('pino')
async function start() {
    const { state, saveCreds } = await useMultiFileAuthState('auth')
    const sock = makeWASocket({ auth: state, logger: P({ level: 'silent' }), printQRInTerminal: true })
    sock.ev.on('creds.update', saveCreds)
    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0]
        if (!msg.message || msg.key.fromMe) return
        const texto = msg.message.conversation || msg.message.extendedTextMessage?.text || ''
        const jid = msg.key.remoteJid
        if (texto.toLowerCase() === '!caçafantasma' || texto.toLowerCase() === '!cacafantasma') {
            await sock.sendMessage(jid, { text: '👻 *CAÇA-FANTASMA ATIVADO!* 🎃\n\nCaçando fantasmas...\nEncontrei 3 fantasmas! 👻👻👻\n\nDigite !menu' })
        }
        if (texto.toLowerCase() === '!menu') {
            await sock.sendMessage(jid, { text: '🎃 *MANY HALLOWEEN* 🎃\n\n!caçafantasma - caça fantasmas\n!menu - este menu' })
        }
    })
}
start()
