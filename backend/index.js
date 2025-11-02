import express from 'express';
import cors from 'cors';
import OBSWebSocket from 'obs-websocket-js';

const app = express();
app.use(cors());
app.use(express.json());

const obs = new OBSWebSocket();

// Connessione automatica a OBS
async function connectOBS() {
  try {
    await obs.connect('ws://localhost:4455', 'mQIa65sm9gZte29s');
    console.log('Connesso a OBS WebSocket');
  } catch (err) {
    console.error('Errore connessione OBS:', err.message);
    setTimeout(connectOBS, 5000); // ritenta ogni 5s
  }
}
connectOBS();

// Endpoint API
app.get('/api/scenes', async (req, res) => {
  try {
    const { scenes, currentProgramSceneName } = await obs.call('GetSceneList');
    res.json({ scenes, currentProgramSceneName });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/scene', async (req, res) => {
  const { name } = req.body;
  try {
    await obs.call('SetCurrentProgramScene', { sceneName: name });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Backend in ascolto su http://localhost:${PORT}`));
