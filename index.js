import OBSWebSocket from 'obs-websocket-js';

const obs = new OBSWebSocket();

async function main() {
  try {
    // Connessione
    await obs.connect('ws://localhost:4455', 'mQIa65sm9gZte29s');
    console.log('Connesso a OBS WebSocket');



    // --- INFO BASE ---
    const { obsVersion } = await obs.call('GetVersion');
    console.log(`🔹 Versione OBS: ${obsVersion}`);

    const { currentProgramSceneName, scenes } = await obs.call('GetSceneList');
    console.log('\nScene disponibili:');
    for (const scene of scenes) {
      console.log(`- ${scene.sceneName}`);
      // Otteniamo le fonti per ogni scena
      const { sceneItems } = await obs.call('GetSceneItemList', { sceneName: scene.sceneName });
      sceneItems.forEach((item) => console.log(`   • ${item.sourceName}`));
    }

    console.log(`\nScena attiva: ${currentProgramSceneName}`);
    console.log('\nIn ascolto degli eventi OBS...\n');

    // --- EVENTI ---

    
    // Cambio scena
    obs.on('CurrentProgramSceneChanged', (data) => {
      console.log('Scena cambiata:', data.sceneName);
    });

    // Stato registrazione
    obs.on('RecordStateChanged', (data) => {
      console.log('Registrazione:', data.outputActive ? 'AVVIATA' : 'FERMATA');
    });

    // Stato streaming
    obs.on('StreamStateChanged', (data) => {
      console.log('Streaming:', data.outputActive ? 'AVVIATO' : 'FERMATO');
    });

    // Scene items
    obs.on('SceneItemAdded', (data) => {
      console.log('Fonte aggiunta:', data.sceneItemId, data.sceneName, data.sourceName);
    });

    obs.on('SceneItemRemoved', (data) => {
      console.log('Fonte rimossa:', data.sceneItemId, data.sceneName, data.sourceName);
    });


    // Disconnessione
    obs.on('ConnectionClosed', () => {
      console.log('Connessione chiusa da OBS');
      process.exit(0);
    });

  } catch (err) {
    console.error('Errore:', err);
  }
}

main();
