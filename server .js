const express = require('express');
const fca = require('ws3-fca');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

app.post('/generate', async (req, res) => {
  const { type, value } = req.body;

  try {
    let api;
    if (type === 'appstate') {
      const appstate = JSON.parse(value);
      api = await fca({ appState: appstate });
    } else if (type === 'cookie') {
      api = await fca({ cookie: value });
    } else {
      return res.status(400).send('❌ Invalid type');
    }

    const uid = api.getCurrentUserID();
    const token = `mock_access_token_${uid}_${Date.now()}`;

    return res.send(`<h2>🎉 Token Generated</h2><p><b>UID:</b> ${uid}</p><p><b>Token:</b> ${token}</p>`);
  } catch (err) {
    console.error(err);
    return res.status(500).send('<h2>❌ Invalid AppState or Cookie</h2><p>Please check your input.</p>');
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});