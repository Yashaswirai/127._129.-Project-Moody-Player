const express = require('express');
const Router = express.Router();
const songModel = require('../models/song.model');
const uploadImage = require('../Services/Storage.Service.js');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

Router.post('/song', upload.single('audio'),async (req, res) => {
    try {
        const uploadResult = await uploadImage(req.file);
        const { artist, mood } = req.body;
        const newSong = await songModel.create({
            title:uploadResult.name,
            artist,
            url: uploadResult.url,
            mood
        });        
        res.status(200).json({
            message: 'Audio uploaded successfully',
            data: newSong
        });
    } catch (error) {
        res.status(500).json({
            message: 'Audio upload failed',
            error: error
        });
    }
});

Router.get('/song', async (req, res) => {
    mood = req.query.mood;
    try {
        const songs = await songModel.find({ mood: mood });
        res.status(200).json({
            message: 'Songs fetched successfully',
            data: songs
        });
    } catch (error) {
        res.status(500).json({
            message: 'Songs fetch failed',
            error: error
        });
    }
});
module.exports = Router;