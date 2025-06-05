const baileys = require('@whiskeysockets/baileys');

// ✅ Destructure correctly
const { default: makeWASocket, useMultiFileAuthState } = baileys;
const { handleAnswer } = require('./services/user.service');

// ✅ DO NOT put quotes around this path in .env — we use a literal path


async function startBot(io) {
    const { state, saveCreds } = await useMultiFileAuthState('./auth_info');
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
  });

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || !msg.key.remoteJid) return;

    const from = msg.key.remoteJid.replace('@s.whatsapp.net', '');
    const text = msg.message.conversation || msg.message.extendedTextMessage?.text;

    const result = await handleAnswer(from, text);
    await sock.sendMessage(msg.key.remoteJid, { text: result.message });

    // Optional: emit message to Socket.IO
    if (io) {
      io.emit('incoming_message', {
        number: from,
        text,
        response: result.message,
        timestamp: new Date(),
      });
    }
  });

  sock.ev.on('creds.update', saveCreds);
}

module.exports = startBot;
