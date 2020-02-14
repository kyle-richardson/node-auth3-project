// const Users = require('../models/user-model.js');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken')
// const {jwtSecret} = require('../auth/secrets')

const restricted = (req, res, next) => {

    /*PART 1 MVP*/

    // const { username, password } = req.headers
    // if (!(username && password)) {
    //     res.status(401).json({ message: "You shall not pass!" });
    // } else {
    //     Users.findBy({username})
    //         .first()
    //         .then(_user => {
    //             if (_user && bcrypt.compareSync(password, _user.password)) {
    //                 next()
    //             } else {
    //                 res.status(401).json({ message: "You shall not pass!" })
    //             }
    //         })
    //         .catch((err) => { res.status(500).json({ message: err }) })
    // }

    /*PART 2 MVP*/

    if(req.session && req.session.user)
        if(req.params. id) {
            if(req.session.user.id == req.params.id) //the user logged in can only operate on their own account (delete, access content)
                next()
            else
                res.status(401).json({ message: 'You do not have priviledge to access or edit this user.'})
        }
        else 
            next()
    else
        res.status(401).json({ message: "You shall not pass!" })

    /* Token authorization */

    // const token = req.headers.authorization
    // if(token) {
    //     jwt.verify(token, jwtSecret, (err, decodedToken)=> {
    //         if(err) {
    //             res.status(401).json({message: 'authorization failed.  Token has been changed'})
    //         }
    //         else {
    //             next()
    //         }
    //     })
    // }
    // else
    //     res.status(401).json({message: 'authorization failed. No token found'})
        
        
    
}

module.exports = restricted