import OBSWebSocket from 'obs-websocket-js';

const obs = new OBSWebSocket();

async function main() {
  try {
    // Connessione a OBS WebSocket
    await obs.connect('ws://localhost:4455', 'mQIa65sm9gZte29s'); // cambia la password se serve
    console.log('Connesso a OBS WebSocket!');

    // Ottiene la versione
    const version = await obs.call('GetVersion');
    console.log('🔹 Versione OBS:', version.obsVersion);

    // Ottiene la lista delle scene
    const scenes = await obs.call('GetSceneList');
    console.log('Scene disponibili:');
    scenes.scenes.forEach((scene, i) => {
      console.log(`  ${i + 1}. ${scene.sceneName}`);
    });

    // Disconnessione
    await obs.disconnect();
    console.log('Disconnesso da OBS');
  } catch (err) {
    console.error('Errore:', err);
  }
}

main();
