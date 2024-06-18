const upload = require('../services/s3Service');


class AwsController {
    async uploadFile(req, res, next) {
        console.log(req.files)
        if(req.files.file){
            const avatarUrl = await upload(req.files.file)
            return res.json({avatarUrl})
        }else{
            return res.json({message: "not found"})
        }
    }
    async getAll(req, res, next) {
        console.log("hello")
    }
}

module.exports = new AwsController();