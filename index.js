import OBSWebSocket from 'obs-websocket-js';

const obs = new OBSWebSocket();

async function main() {
  try {
    // Connessione
    await obs.connect('ws://localhost:4455', 'mQIa65sm9gZte29s'); // cambia password se serve
    console.log('✅ Connesso a OBS WebSocket\n');

    // --- INFO BASE ---
    const { obsVersion } = await obs.call('GetVersion');
    console.log(`🔹 Versione OBS: ${obsVersion}`);

    const { currentProgramSceneName, scenes } = await obs.call('GetSceneList');
    console.log('\n🎬 Scene disponibili:');
    for (const scene of scenes) {
      console.log(`- ${scene.sceneName}`);
      // Otteniamo le fonti per ogni scena
      const { sceneItems } = await obs.call('GetSceneItemList', { sceneName: scene.sceneName });
      sceneItems.forEach((item) => console.log(`   • ${item.sourceName}`));
    }

    console.log(`\n👉 Scena attiva: ${currentProgramSceneName}`);
    console.log('\n📡 In ascolto degli eventi OBS...\n');

    // --- EVENTI ---

    // Cambio di scena
    obs.on('CurrentProgramSceneChanged', (data) => {
      console.log(`🎥 Scena cambiata → ${data.sceneName}`);
    });

    // Avvio/Fine registrazione
    obs.on('RecordStateChanged', (data) => {
      if (data.outputActive) {
        console.log('⏺️ Registrazione avviata');
      } else {
        console.log('⏹️ Registrazione fermata');
      }
    });

    // Avvio/Fine streaming
    obs.on('StreamStateChanged', (data) => {
      if (data.outputActive) {
        console.log('📡 Streaming avviato');
      } else {
        console.log('🛑 Streaming fermato');
      }
    });

    // Disconnessione
    obs.on('ConnectionClosed', () => {
      console.log('🔌 Connessione chiusa da OBS');
      process.exit(0);
    });

  } catch (err) {
    console.error('❌ Errore:', err);
  }
}

main();
