import fs from 'fs';
import readline from 'readline';
import { google } from 'googleapis';
import { config } from '../config/config';
import { OAuth2Client } from 'googleapis-common';
var path = require("path");


export class GoogleSheet {
    scopes = ['https://www.googleapis.com/auth/spreadsheets']
    tokenPath: string
    credPath: string

    constructor() {
        this.tokenPath = path.resolve('./info/token.json')
        this.credPath = path.resolve('./info/credentials.json')
    }

    async getObject(sheetName: string, objectName: string) {
        const auth = await this.authorize(JSON.parse(fs.readFileSync(this.credPath, 'utf8')))
        const sheets = google.sheets({ version: 'v4', auth })
        const r = await sheets.spreadsheets.values.get({
            spreadsheetId: config.dataFile,
            range: `${sheetName}!A2:Y`,
        })

        if (r) {
            const rows = r.data.values
            return rows;
        }
    }

    async authorize(cred: any) {
        const { client_secret, client_id, redirect_uris } = cred.installed
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0])

        if (fs.existsSync(this.tokenPath)) {
            oAuth2Client.setCredentials(JSON.parse(fs.readFileSync(this.tokenPath, 'utf8')))
            return oAuth2Client
        }

        return this.getNewToken<typeof oAuth2Client>(oAuth2Client)
    }

    async getNewToken<T = any>(oAuth2Client: any): Promise<T> {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: this.scopes
        })

        console.log('Authorize this app by visiting this url:', authUrl)
        const code = await this.readlineAsync('Enter the code from that page here: ')
        const token = await new Promise((resolve, reject) => {
            oAuth2Client.getToken(code, (err: any, token: any) => {
                err ? reject(err) : resolve(token)
            })
        })
        oAuth2Client.setCredentials(token)
        // Store the token to disk for later program executions
        fs.writeFileSync(this.tokenPath, JSON.stringify(token))
        console.log('Token stored to', this.tokenPath)

        return oAuth2Client
    }

    async readlineAsync(question: string) {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        })

        return new Promise((resolve) => {
            rl.question(question, (answer) => {
                rl.close()
                resolve(answer)
            })
        })
    }
}