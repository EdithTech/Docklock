const express = require('express')
const app = express()
const mysql = require('mysql')
const ejs = require('ejs')
const bodyParser = require('body-parser')
const path = require('path')
const Multer = require("multer")
const { google } = require("googleapis")
const { readFileSync } = require('fs')

app.use('/db',express.static('public/data_files/'))

// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json())
// app.use(express.static(__dirname+'/public/css'))
// app.use(express.static(__dirname+'/public/data_files'))
// app.use(express.static(__dirname+'/public/favicon'))
// app.use(express.static(__dirname+'/public/images'))
// app.use(express.static(__dirname+'/public/javascript'))
// app.use(express.static(__dirname+'/views'))
app.use(express.static(__dirname+'/public'))

app.use(express.json())
app.use(express.urlencoded({extended: false}))

const homePage = readFileSync('./public/2nd.html')

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Edith@2331',
    database: 'docklock'
})

con.connect((err) => {
    if (!err) console.log('Database connection successfull')
    else console.log(err)
})

/* const multer = Multer({
    storage: Multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, `${__dirname}/audio-files`);
        },
        filename: function (req, file, callback) {
            callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
        },
    }),
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

const authenticateGoogle = () => {
    const auth = new google.auth.GoogleAuth({
        keyFile: `${__dirname}/doclock-191122-fb4486bb150a.json`,
        scopes: "https://www.googleapis.com/auth/drive",
    });
    return auth;
};

const uploadToGoogleDrive = async (file, auth) => {
    const fileMetadata = {
        name: file.originalname,
        parents: ["1dMmbXts41K-gGyG0AoYb2Bj3ay3AuFrA"], // folder id, copied from its link
    };

    const media = {
        mimeType: file.mimetype,
        body: fs.createReadStream(file.path),
    };

    const driveService = google.drive({ version: "v3", auth });

    const response = await driveService.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: "id",
    });
    return response;
};

app.post('/upload-docs.html', multer.single("file"), async (req, res) => {
    // app.post('/upload-docs.html', (req, res) => {
    console.log(req.body)
    const { name, d_name, pass, my_file } = req.body

    try {
        if (!req.body.file) {
            res.status(400).send("No file uploaded.");
            return;
        }
        const auth = authenticateGoogle();
        const response = await uploadToGoogleDrive(req.body.file, auth);
        deleteFile(req.body.file.path);
        res.status(200).json({ response });
    } catch (err) {
        console.log(err);
    }

    var sql = `INSERT INTO user_documents VALUES ("${name}", "${d_name}", "${pass}", "${req.body.file}")`

    con.query(sql, (err) => {
        if (err) throw err
        console.log('Data Insertion Successfull')
    })

    res.sendFile(path.resolve(__dirname, './public/upload-docs.html'))
}) */
var my_path

const storage = Multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/data_files');
    },
    filename: (req, file, cb) => {
        console.log(file);
        my_path = Date.now() + path.extname(file.originalname)
        cb(null, my_path);
    }
});

const upload = Multer({ storage: storage });

app.get('/public/2nd.html', (req, res) => {
    res.write(homePage)
    res.end()
})

app.post('/public/2nd.html', upload.any('file'), (req, res) => {
    const { name, d_name } = req.body

    var sql = `INSERT INTO user_documents VALUES (
        "${name}", 
        "${d_name}", 
        "${req.files[0].originalname}", 
        "${my_path}"
        )`
    // D:/Akhi/PRMIT&R/Sem - 5/DBMS/DocLock/public/data_files/${my_path}

    con.query(sql, (err) => {
        if (err) throw err
        console.log('Data Insertion Successfull')
    })

    res.sendFile(path.resolve(__dirname, './public/2nd.html'))
})

app.get('/views/view-page.ejs', (req, res) => {
    var sql = 'SELECT * FROM user_documents'
    con.query(sql, (err, data) => {
        if (err) throw err
        else {
            // res.writeHead(200, { 'content-type': 'text/html' })
            res.render('../views/view-page.ejs', { sampleData: data })
        }
    })
})

app.listen(5000, (req, res) => {
    console.log('Server is listening on port 5000')
})