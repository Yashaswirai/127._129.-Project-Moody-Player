const fs = require('fs');
const path = require('path');
const axios = require('axios');

async function downloadMusic(url) {
    try {
        const uploadsFolder = path.join(__dirname, '../../uploads');
        if (!fs.existsSync(uploadsFolder)) {
            fs.mkdirSync(uploadsFolder, { recursive: true });
        }

        const fileName = path.basename(url);
        const filePath = path.join(uploadsFolder, fileName);

        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream',
        });

        const writer = fs.createWriteStream(filePath);

        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', () => {
                resolve(fileName);
            });
            writer.on('error', reject);
        });
    } catch (error) {
        console.error('Error downloading music:', error);
        throw error;
    }
}

function deleteMusic(fileName) {
    try {
        const uploadsFolder = path.join(__dirname, '../../uploads');
        const filePath = path.join(uploadsFolder, fileName);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        } else {
            console.log(`File ${fileName} does not exist.`);
        }
    } catch (error) {
        console.error('Error deleting music:', error);
        throw error;
    }
}
module.exports = { downloadMusic , deleteMusic };