console.time();
const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');
const { Op } = require("sequelize")
const {
  suscriptions: modelSuscription
} = require("./models/index");
const dotenv = require('dotenv');
dotenv.config()
// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */

async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}


let suscriptionData
const getSuscriptionLastHour = async (req, res) => {
  const date = new Date()
  date.setHours(date.getHours() - 4)

const suscription = await modelSuscription.findAll({
  attributes: {
    exclude: ["id","created_at"]
  },
   where: {
    created_at: {
      [Op.gt]: date,
    }
  } 
});
suscriptionData = suscription
return suscriptionData
};

function authorizeAndWrite () {
  async function authorize() {
    let client = await loadSavedCredentialsIfExist();
    if (client) {
      return client;
    }
    client = await authenticate({
      scopes: SCOPES,
      keyfilePath: CREDENTIALS_PATH,
    });
    if (client.credentials) {
      await saveCredentials(client);
    }
    return client;
  }

    function writeData(auth) {
        const sheets = google.sheets({ version: 'v4', auth });
        let values = []   
        for (let i = 0; i < suscriptionData.length; i++) {
           values.push([suscriptionData[i].name, suscriptionData[i].email, suscriptionData[i].company, suscriptionData[i].number]) 
    }
    const resource = {
      values,
    };
    sheets.spreadsheets.values.append(
      {
        spreadsheetId: process.env.spreadsheet,  // spreadsheet ID
        range: 'A1',
        valueInputOption: 'RAW',
        resource: resource,
      },
      (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log(
            'cells updated'
          );
          console.timeEnd()
        }
      }
    );
  } 
  
  
  authorize().then(writeData)
}

getSuscriptionLastHour()
.then(resp=>{
    if(resp.length == []){
      console.timeEnd()
    } else {
      authorizeAndWrite()
    }
}) 




 



