const express = require('express')
// const multer = require('multer');
const Reguser = require('../models/Reguser')
const uuid = require('uuid');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const {check, validationResult} = require('express-validator');
const router = express.Router();
const saltRounds = 10;
var Privatekey = "MIICXAIBAAKBgQCRV0EgAVN9pqLfvrUSzGXFeqaJpalBDblvbzKGpLLnYaOt/qOWCquDkugKhkf+Da+3KoZYOLcdsJr5KBclvpCGA2bRxLBl41kF6/6jFU0TdTcXb7mHdfr8hvnxTQB4t1whxJRRyc0rOYZShL/YJQIVe+6oZRPhae//xrGbT2Ou3QIDAQABAoGABLuInVgttcu1Rf/ZuZD6R2HlBlpkln+x6BUA2i2Gvc4KHGJMRVh3mUMxVxZkRbuAW0CBO2ItZEQZ578McegwoH+6QYI11amJGtqqqTZUrgDxUQX9OvnUZqI0H5UQ9nwfD230tzmFRU8aRwtnSaURijzQROHLWKjF79dIKo/EQakCQQDnhersypNlhQOS916O97NhJMX8vBDDvhc3WB2/kifGGs04Lx1K9KUYfdFbkRVPi6rDTg5l1mnV1WDateUeXzFTAkEAoLTY3yydiywD0JG4DLRYcjQm02jVlFJu9JwYBz9YQAFS/KmulsdjxmQjY3HQd4J/EonYXrPvhtYrIbnARsCpDwJADPYlWc5ZhCR3N8IbjBt38mdRoj2RHrRErneDatcu3NthQ9T3advaZk2c6+hqbgKes8Jp8e+YCz2f536pbhLcOwJACa26nf5G4rnc5PPRvNojtYUUjYjzzAIG8q5v+AfFnd02jUb+38/UX39qbjPNlVUDqC8rG9EEbP97C4XvYZN62wJBALn9oqUN876PhQwNAlpsD7T2ebpFVnXjEl8dziFFTjtHXQ7s2zc8BOO9XAod0H9oupQc2KLqBmoG6McjR9Mv2AE="

// const storage = multer.diskStorage({
//     destination: (req, file, callback) => {
//         callback(null, "../userdashboard/public/uploads")  
//     },
//     filename: (req, file, callback) => {
//         callback(null, file.originalname);
//     }

// })

// const upload = multer({storage : storage})

router.get('/Getuser', async (req, res) => {
    try {
        let userData = await Reguser.find({ $and: [{role: 0 },{Status:0}]})

        let finaldata = {
            "users": userData,
            "userlength": userData.length
        }

        res.status(200).json({ 'status': 200, 'data': finaldata, 'message': 'successfully fetched Data', 'error': false })
    }
    catch (error) {
        res.status(400).json({ 'status': 400, 'message': error.message, 'error': true })
    }
})

router.post('/AdminAccess', async (req, res) => {
    try {
        var reqdata = req.body

        const header = req.headers['authorization']?.split(' ')[1]

        if (!header) {
            throw new Error('no header is here')
        }

        var decoded = jwt.verify(header, Privatekey);

        if (!decoded) {
            throw new Error('no token here')
        }
        console.log(decoded);

        if (!decoded.userData.SuperAdmin) {
            throw new Error('you dont have access')
        }

        await Reguser.findOneAndUpdate({ id: reqdata.Adminid }, { AdminAccess: reqdata.AdminAccess })

        res.status(200).json({ 'status': 200, 'data': null, 'message': 'successfully fetched Data', 'error': false })
    }
    catch (error) {
        res.status(400).json({ 'status': 400, 'message': error.message, 'error': true })
    }
})

router.get('/GetAdmin', async (req, res) => {
    try {
        let userData = await Reguser.find({ $and: [{ role: 1 }, { SuperAdmin: false },{Status:0}] })

        let finaldata = {
            "users": userData,
            "userlength": userData.length
        }

        res.status(200).json({ 'status': 200, 'data': finaldata, 'message': 'successfully fetched Data', 'error': false })
    }
    catch (error) {
        res.status(400).json({ 'status': 400, 'message': error.message, 'error': true })
    }
})


router.post('/Adduser',[check('firstname').not().isEmpty().isLength({min:5}).withMessage('firstName must have more than 5 characters'),
                         check('lastname').not().isEmpty().isLength({min:5}).withMessage('lastName must have more than 5 characters'),
                         check('email', 'Your email is not valid').not().isEmpty().isEmail().normalizeEmail(),
                         check('Password', 'Your password must be at least 8 characters').not().isEmpty().isLength({min: 8}),
],
 async (req, res) => {

    try {
        var reqdata = req.body;

        const errors = validationResult(req);
        console.log(errors);

        if (!errors.isEmpty()) {
          return res.status(400).json({ 'status': 400, 'message': errors.array(), 'error': true })
          }

        const ExistingEmail = await Reguser.findOne({ Email: reqdata.Email }).countDocuments();

        if (ExistingEmail) {
            throw new Error("Email already exists")
        }

        const enpPassword = bcrypt.hashSync(reqdata.Password, saltRounds);

        delete reqdata.Password;

        var token = jwt.sign(reqdata, Privatekey)

        let finaldata = new Reguser({
            id: uuid.v4(),
            Firstname: reqdata.firstname,
            Lastname: reqdata.lastname,
            role: reqdata.role,
            Email: reqdata.email,
            Password: enpPassword,
            Token: token,
            Status: reqdata.status
        })
        console.log(finaldata)

       
        let regdata = await finaldata.save()
        sendMail(reqdata)

       res.status(200).json({ 'status': 200, 'data': regdata, 'message': 'successfully posted', 'error': false })
 }
    catch (error) {
        res.status(400).json({ 'status': 400, 'message': error.message, 'error': true })
    }
})

router.post('/login', async (req, res) => {
    try {

        var reqdata = req.body;

        if (Object.keys(reqdata).length === 0) {
            throw new Error("please provide data.");
        }

        const ExistingEmail = await Reguser.findOne({ $and: [{ Email: reqdata.Email }, { role: reqdata.role },{Status:0}] }).countDocuments();

        if (ExistingEmail) {

            var userData = await Reguser.findOne({ $and: [{ Email: reqdata.Email }, { role: reqdata.role },{Status:0}] });
            console.log('userdata',userData)
            const depPassword = bcrypt.compareSync(reqdata.Password, userData.Password);
            
            if (depPassword) {
                delete userData.Password;
                var token = jwt.sign({ userData }, Privatekey)
                userData.Token = token;

                await Reguser.findOneAndUpdate({ Email: reqdata.Email }, { user_token: token });
                console.log('userdata',userData);
                res.status(200).json({ "status": 200, "data": userData, "message": "Login successfully", "error": false })

            } else {
                throw new Error("password not matched..")
            }

        } else {
            throw new Error("Email not exist.")
        }


    } catch (error) {
        res.status(400).json({ "status": 400, "message": error.message, "error": true })
    }
})



router.get('/getUserDetails', async (req, res) => {
    try {
        const header = req.headers['authorization']?.split(' ')[1]

        if (!header) {
            throw new Error('no header is here')
        }

        var decoded = jwt.verify(header, Privatekey);

        if (!decoded) {
            throw new Error('no token here')
        }
        console.log(decoded);
        var user = await Reguser.findOne({$and: [{id: decoded.userData.id},{Status:0}] })

        if (!user) {
            throw new Error('no user found')
        }

        res.status(200).json({ 'status': 200, 'data': user, 'message': 'successfully fetched Data', 'error': false })
    }
    catch (error) {
        res.status(400).json({ 'status': 400, 'message': error.message, 'error': true })
    }
})

router.put('/AdminEdit/:id', async (req, res) => {
    try {
        var reqdata = req.body;
        console.log(reqdata);
        const header = req.headers['authorization']?.split(' ')[1]

        console.log(header);

        if (!header) {
            throw new Error('no header is here')
        }

        var decoded = jwt.verify(header, Privatekey);

        if (!decoded) {
            throw new Error('no token here')
        }

        if (!decoded.userData.AdminAccess) {
            throw new Error('you dont have Admin access')
        }


        let checkUser = await Reguser.findOne({ id: req.params.id });
        console.log('checkuser',checkUser);
        if (!checkUser) {
            throw new Error('User not Exist..')
        }

        let saveData = await Reguser.findOneAndUpdate({ id: req.params.id }, reqdata,{new:true})

        res.status(200).json({ 'status': 200, 'data': saveData, 'message': 'successfully Admin changes done', 'error': false })
    }
    catch (error) {
        res.status(400).json({ 'status': 400, 'message': error.message, 'error': true })
    }
})


router.post('/AdminDeleteuser/:id', async (req, res) => {
    try {
        var reqdata = req.body;
        console.log(reqdata);
        const header = req.headers['authorization']?.split(' ')[1]

        console.log(header);

        if (!header) {
            throw new Error('no header is here')
        }

        var decoded = jwt.verify(header, Privatekey);

        if (!decoded) {
            throw new Error('no token here')
        }

        if (!decoded.userData.AdminAccess) {
            throw new Error('you dont have Admin access')
        }


        let checkUser = await Reguser.findOne({id: req.params.id});
        if(!checkUser){
          throw new Error('User not Exist..')
        }
        let requestdata = {Status:1,modifiedby:decoded.userData.id}
        let Deletedata = await Reguser.findOneAndDelete({id: req.params.id})
        console.log(Deletedata)
        res.status(200).json({ 'status': 200, 'data': Deletedata, 'message': 'Deleted successfully', 'error': false })
    }
    catch (error) {
        res.status(400).json({ 'status': 400, 'message': error.message, 'error': true })
    }
})


router.put('/Edituser/:id', async (req, res) => {
    try {
        var reqdata = req.body;
        let checkUser = await Reguser.findOne({ id: req.params.id });
        if (!checkUser) {
            throw new Error('User not Exist..')
        }
        let saveData = await Reguser.findOneAndUpdate({ id: req.params.id }, reqdata, { new: true })
        console.log(saveData)
        res.status(200).json({ 'status': 200, 'data': saveData, 'message': 'successfully User Details updated', 'error': false })
    }
    catch (error) {
        res.status(400).json({ 'status': 400, 'message': error.message, 'error': true })
    }
})

// router.get('/sendmail', async (req, res) => {
//     try {
//         const transporter = nodemailer.createTransport({
//             host: 'smtp.gmail.com',
//             port: 587,
//             secure: false,
//             auth: {
//                 type: "OAuth2",
//                 user: 'itspktechie@gmail.com',
//                 pass: 'PrEm@879',

//                   clientId: '900586675313-tf9tcqhmbhb7s870lifequ3q0v9ddicj.apps.googleusercontent.com',
//                   clientSecret: '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',
//                   refreshToken: '1//04DAWZ9-yzkx2CgYIARAAGAQSNwF-L9IrekQn8p_UA_UU1JoM8lXv-2g5a-Sx9DE29J61_8QKiac2ReIimC-BR_zAk-JMldfjW6U'
//             }
//         });
//         const mailConfigurations = {
//             from: 'itspktechie@gmail.com',
//             to: 'premkumarr393@gmail.com',
//             subject: 'Sending Email using Node.js',
//             html: "<h1>hi iam pk...</h1>"
//         };
//         transporter.sendMail(mailConfigurations, function (error, info) {
//             console.log(error);
//             if (error) throw new Error(error);
//             console.log('Email Sent Successfully');
//             console.log(info);
//         });
//         res.status(200).json({ 'status': 200, 'data': '', 'message': 'successfully fetched Data', 'error': false })

//     }
//     catch (error) {
//         res.status(400).json({ "status": 400, "message": error.message, "error": true })
//     }
// })

// router.put('/Edituser/:id', async (req, res) => {
//     try {
//         var reqdata = req.body;
//         let checkUser = await userdetails.findOne({id: req.params.id});
//         if(!checkUser){
//           throw new Error('User not Exist..')
//         }
//         let saveData = await userdetails.findOneAndUpdate({id: req.params.id},reqdata,{new:true})
//         console.log(saveData)
//         res.status(200).json({ 'status': 200, 'data': saveData, 'message': 'successfully User Details updated', 'error': false })
//     }
//     catch (error) {
//         res.status(400).json({ 'status': 400, 'message': error.message, 'error': true })
//     }
// })

// router.delete('/Deleteuser/:id', async (req, res) => {
//     try {
//         let checkUser = await userdetails.findOne({id: req.params.id});
//         if(!checkUser){
//           throw new Error('User not Exist..')
//         }
//         let Deletedata = await userdetails.findOneAndDelete({id: req.params.id})
//         console.log(Deletedata)
//         res.status(200).json({ 'status': 200, 'data': Deletedata, 'message': 'Deleted successfully', 'error': false })
//     }
//     catch (error) {
//         res.status(400).json({ 'status': 400, 'message': error.message, 'error': true })
//     }
// })

// router.post('/pagination', async (req, res) => {
//     try {
//         var {page} = req.body;
//         console.log(page);
//         page = page ? page : 0;

//         const Itemperpage = 5;

//         var skip = Itemperpage * page;
//         console.log(skip)

//         var tempdata = {};

//         var pageCheck = await userdetails.aggregate([
//             {
//                 $match : tempdata,
//             },
//         ])
//         var pageCount = pageCheck.length;
//         console.log(pageCount);

//         var pages = await userdetails.aggregate([
//             {
//                 $match: tempdata,
//             },
//         ]).skip(skip).limit(Itemperpage)

//         var nextPage = (skip + Itemperpage < pageCount) ? true : false

//         var totalpage = Math.ceil(pageCount / Itemperpage);

//         var finalpageData = {
//             userpages : pages,
//             currentPage : page,
//             totalpage : totalpage,
//             nextPage: nextPage
//         }
//         res.status(200).json({ 'status': 200, 'data': finalpageData, 'message': 'Pages fetched', 'error': false })
//     }
//     catch (error) {
//         res.status(400).json({ 'status': 400, 'message': error.message, 'error': true })
//     }
// })

// router.get('/sendmail', async (req, res) => {
//     try {
//         let transporter = nodemailer.createTransport({
//             host: 'smtp.gmail.com',
//             port: 587,
//             secure: false, // true for 465, false for other ports
//             auth: {
//                 user: 'premmathaiyan879@gmail.com',
//                 pass: ''
//             }
//         });

//         // setup email data with unicode symbols
//         let mailOptions = {
//             from: '"Prem kumar" <premmathaiyan879@gmail.com>', // sender address
//             to: 'itspktechie@gmail.com', // list of receivers
//             subject: 'Test email', // Subject line
//             text: 'Hello world?', // plain text body
//             html: '<b>Hello world?</b>' // html body
//         };

//         // send mail with defined transport object
//        await  transporter.sendMail(mailOptions, (error, info) => {
//             if (error) {
//                 console.log(error);
//             } else {
//                 console.log('Message sent: %s', info.messageId);
//             }
//         });
//         res.status(200).json({ 'status': 200, 'data': '', 'message': 'successfully fetched Data', 'error': false })

//     }
//     catch (error) {
//         res.status(400).json({ "status": 400, "message": error.message, "error": true })
//     }
// })

function sendMail(data) {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            type: "OAuth2",
            user: 'itspktechie@gmail.com',
            pass: 'PrEm@879',

            clientId: '900586675313-tf9tcqhmbhb7s870lifequ3q0v9ddicj.apps.googleusercontent.com',
            clientSecret: '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',
            refreshToken: '1//04c7HrlfTOp4YCgYIARAAGAQSNwF-L9Irc2i3adT45hylEX_LxdoPOpS7_SherMr2bKoTYN3mFgWLd2y2rrh5n-phM_3uFJvM0_A'
        }
    });
    const mailConfigurations = {
        from: 'itspktechie@gmail.com',
        to: ['premkumarr393@gmail.com', data.email],
        subject: data.firstname + data.lastname + ' user register',
        html: "<h1>hi iam pk...</h1>"
    };
    transporter.sendMail(mailConfigurations, function (error, info) {
        console.log(error);
        if (error) throw new Error(error);
        console.log('Email Sent Successfully');
        console.log(info);
    });
}

module.exports = router;