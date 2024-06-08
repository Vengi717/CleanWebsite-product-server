
//const { ensureUserLoggedIn } = require("../middleware/accessControls/auth");

const multer = require('multer')
//const {  } = require("../middleware/accessControls/auth");

module.exports.UtilFileUploadFirebase = async (event) => {
    console.log("fffffffsfdsdfsffffff")


    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'images/')
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname) 
        },
    })

    console.log("1111111111111")


    const upload = multer({ storage: storage })
    upload.single('file')
    console.log("Ffffffffffffffffffffff")
    /* return await ensureUserLoggedIn(event, async () => {
         console.log("fffffffffffffffffffffffffffsss")
         console.log("sss",event)
     })*/
}