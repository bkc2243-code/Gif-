const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Route to upload video and convert to GIF
app.post('/upload', upload.single('video'), (req, res) => {
    const videoPath = req.file.path;
    const gifPath = `outputs/${Date.now()}.gif`;
    const watermarkPath = 'path/to/watermark.png'; // Change this to your watermark path

    ffmpeg(videoPath)
        .outputOptions('-pix_fmt', 'rgb24')
        .toFormat('gif')
        .on('end', () => {
            // Add watermark to the generated GIF
            sharp(gifPath)
                .composite([{ input: watermarkPath, gravity: 'southeast' }])
                .toFile(gifPath, (err) => {
                    if (err) {
                        return res.status(500).send('Error adding watermark.');
                    }
                    res.download(gifPath, () => {
                        fs.unlinkSync(videoPath);
                        fs.unlinkSync(gifPath);
                    });
                });
        })
        .on('error', (err) => {
            res.status(500).send('Error converting video to GIF.');
        })
        .save(gifPath);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
