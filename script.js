const axios = require('axios');
const fs = require('fs');
const path = require('path')

const token = "" // token
const guildId = ""; // id do servidor

const pastaDestino = './stickers';

if (!fs.existsSync(pastaDestino)) {
  fs.mkdirSync(pastaDestino, { recursive: true });
}


const headers = { 'Authorization': token };
axios.get(`https://discord.com/api/v9/guilds/${guildId}/stickers`, { headers })
  .then(response => {
    if (response.status !== 200) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
    return response.data;
  }).then(stickers => {
    for (let i = 0; i < stickers.length; i++) {
      const sticker = stickers[i];
      const filename = `${sticker.name.replace(/[\\/:\*\?"<>\|]/g, '')}${string(4)}.png`; 
      const url = `https://media.discordapp.net/stickers/${sticker.id}.png?size=160`; 
      axios.get(url, { responseType: 'stream' }).then(response => {
        const dest = fs.createWriteStream(path.join(pastaDestino, filename.replace('/', '')));
        response.data.pipe(dest); 
        console.log(`Sticker ${filename} baixado com sucesso`);
      }).catch(error => {
        console.error(`Erro ao baixar o sticker ${filename}: ${error}`);
      });
    }
  })
  .catch(error => {
    console.error(`Erro ao obter a lista de stickers: ${error}`);
  });
  

  function string(tamanho) {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let resultado = '';
    for (let i = 0; i < tamanho; i++) {
      const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
      resultado += caracteres.charAt(indiceAleatorio);
    }
    return resultado;
  }