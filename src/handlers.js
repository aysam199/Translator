const fs = require("fs");
const path = require("path");
require('dotenv').config()

// API request for translator
const LanguageTranslatorV3 = require('ibm-watson/language-translator/v3');
const { IamAuthenticator } = require('ibm-watson/auth');

const languageTranslator = new LanguageTranslatorV3({
    authenticator: new IamAuthenticator({ apikey: process.env.apiKey }),
    url: process.env.url,
    version: '2018-05-01',
}); // end 

const handleHomeRoute = (request, response) => {
    const indexFilePath = path.join(__dirname, "..", "public", "index.html");
    fs.readFile(indexFilePath, (err, file) => {
        if (err) {
            console.log(err);
            response.writeHead(500);
            response.end("an error occured");
        } else {
            response.writeHead(200, { "Content-Type": "text/html" });
            response.end(file);
        }
    });
};
const handlePublic = (request, response) => {
    const url = request.url;
    const extension = url.split(".")[1];
    const extensionType = {
        html: "text/html",
        css: "text/css",
        js: "application/javascript",
        ico: "image/x-icon",
        png: 'image/png'
    };
    const filePath = path.join(__dirname, "..", url);
    fs.readFile(filePath, (err, file) => {
        if (err) {
            console.log(err);
            response.writeHead(500);
            response.end("an error occured");
        } else {
            response.writeHead(200, { "Content-Type": extensionType[extension] });
            response.end(file);
        }
    });
};

const handleSearch = (req, res) => {
    let wordToTranslate = '';
    req.on('data', (input) => {
        wordToTranslate += input;
    })
    req.on('end', (input) => {
        let data = JSON.parse(wordToTranslate)
        languageTranslator.translate(
            {
                text: data.searchVal, // text to translate
                source: data.fromLang, //lang to translate from
                target: data.toLang // lang to translate to
            })
            .then(response => {
                let translated = JSON.stringify(response.result, null, 2)
                res.writeHead(200)
                res.end(translated)
            })
            .catch(err => {
                res.writeHead(500)
                res.end('server error')
            });


    })
    req.on('error', (error) => {
        res.writeHead(500)
        res.end('server error')
    })

}


module.exports = {
    handleHomeRoute,
    handlePublic,
    handleSearch
};
