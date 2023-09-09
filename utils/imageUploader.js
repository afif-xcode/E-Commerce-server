const cloudinary = require("cloudinary").v2;

exports.imageUploadToCloudinary = async(file, folder, height, quality) => {
    const option = {folder};
    if(height) {
        option.height = height;
    }
    if(quality) {
        option.quality = quality;
    }
    option.resource_type = "auto";
    return await cloudinary.uploader.upload(file.tempFilePath, option);
}

exports.imageDeleteFromCloudinary = async (fileToDelete) => {
    return new Promise((resolve) => {

        cloudinary.uploader.destroy(fileToDelete, (error, result) => {
            console.log('result :: ', result);
            resolve({
                url: result.secure_url,
                asset_id: result.asset_id,
                public_id: result.public_id,
            }, {
                resource_type: "auto",
            })
        })
    })
}