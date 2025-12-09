const express = require('express');
const cors = require('cors');
const { RouterOSAPI } = require('node-routeros');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.post('/api/mikrotik/test-connection', async (req, res) => {
  const { ip, username, password, port } = req.body;

  if (!ip || !username || !password) {
    return res.status(400).json({
      success: false,
      error: "Missing ip/username/password"
    });
  }

  const client = new RouterOSAPI({
    host: ip,
    user: username,
    password: password,
    port: port || 8728,
    timeout: 5
  });

  try {
    await client.connect();
    const data = await client.write("/system/resource/print");
    await client.close();

    return res.json({
      success: true,
      message: "Connected successfully via RouterOS API",
      data
    });

  } catch (err) {
    console.log("Error:", err.message);
    return res.status(500).json({
      success: false,
      error: err.message || "Connection failed"
    });
  }
});

app.get('/', (req, res) => {
  res.json({ status: "proxy ok" });
});

app.listen(PORT, () => {
  console.log("Proxy running on port", PORT);
});
