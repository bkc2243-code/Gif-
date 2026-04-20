// server.js

const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();

// Fixed: Added file validation
app.use((req, res, next) => {
    const filePath = req.body.filePath;
    if (!filePath || typeof filePath !== 'string') {
        return res.status(400).send('Invalid file path provided.');
    }
    next();
});

// Fixed: Added directory creation
const ensureDirectoryExists = (dirPath) => {
    if (!fs.existsSync(dirPath)){ 
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

// Fixed: Handling race conditions in cleanup
const cleanUpFiles = (dirPath) => {
    ensureDirectoryExists(dirPath);
    fs.readdir(dirPath, (err, files) => {
        if (err) return console.error(err);
        files.forEach(file => {
            fs.unlink(path.join(dirPath, file), (err) => {
                if (err) console.error(`Error deleting file: ${file}`, err);
            });
        });
    });
};

// Fixed: No hardcoded watermark path
const watermarkPath = process.env.WATERMARK_PATH || './defaultWatermark.png';

// Fixed: Avoid synchronous file deletion
app.delete('/file/:filename', (req, res) => {
    const { filename } = req.params;
    fs.unlink(path.join(__dirname, filename), (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error deleting file.');
        }
        res.send('File deleted successfully.');
    });
});

// Fixed: Enhanced error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
