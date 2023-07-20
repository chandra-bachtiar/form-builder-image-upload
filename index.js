// index.js
"use strict";
const express = require('express');
const fs = require('fs-extra');
const fileUpload = require('express-fileupload');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json());
app.use(fileUpload());
app.use(express.static('public'));

// API untuk upload file gambar
app.post('/upload', (req, res) => {
    try {
        if (!req.headers['x-apikey']) {
            res.status(401).json({ message: 'Please provide an API key!' });
            return;
        }

        //check if apikey is correct
        if (req.headers['x-apikey'] !== process.env.APIKEY) {
            res.status(401).json({ message: 'Invalid API key!' });
            return;
        }

        //check if file is exist
        if (!req.files) {
            res.status(400).json({ message: 'No file uploaded!' });
            return;
        }

        //check if file is image
        if (!req.files.image.mimetype.startsWith('image')) {
            res.status(400).json({ message: 'Please upload an image file!' });
            return;
        }

        //check if not have fileName
        if (!req.body.fileName) {
            res.status(400).json({ message: 'Please provide a file name!' });
        }

        const fileName = req.body.fileName;
        const extension = req.files.image.mimetype.split('/')[1];

        //write code to save the file
        fs.writeFile('./public/uploads/' + fileName + '.' + extension, req.files.image.data, (err) => {
            if (err) {
                res.status(500).json({ message: 'Error saving the file!' });
            } else {
                res.json({ message: 'File saved successfully' });
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Error uploading the file!' });
    }
});

// API untuk delete file gambar
app.delete('/upload/:fileName', (req, res) => {
    try {
        if (!req.headers['x-apikey']) {
            res.status(401).json({ message: 'Please provide an API key!' });
            return;
        }

        //check if apikey is correct
        if (req.headers['x-apikey'] !== process.env.APIKEY) {
            res.status(401).json({ message: 'Invalid API key!' });
            return;
        }

        //check if fileName is exist
        if (!req.params.fileName) {
            res.status(400).json({ message: 'Please provide a file name!' });
            return;
        }

        const fileName = req.params.fileName;

        //write code to delete the file
        fs.unlink('./public/uploads/' + fileName, (err) => {
            if (err) {
                res.status(500).json({ message: 'Error deleting the file!' });
            } else {
                res.json({ message: 'File deleted successfully' });
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting the file!' });
    }
});

// Jalankan server
app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
