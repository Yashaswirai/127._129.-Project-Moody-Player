const ImageKit = require("imagekit");

const imagekit = new ImageKit({
    publicKey : process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey : process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint : process.env.IMAGEKIT_URL_ENDPOINT
});

const uploadImage = (file) => {
    return new Promise((resolve, reject) => {
        imagekit.upload({
            file: file.buffer, // required
            fileName: file.originalname, // required
            folder: "songs" // optional
        }, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}

module.exports = uploadImage;