const auth = require('../auth')
const User = require('../models/user-model')
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")

getLoggedIn = async (req, res) => {
    auth.verify(req, res, async function () {
        let decodedToken = jwt.decode(req.cookies.token);
        const loggedInUser = await User.findOne({ _id: decodedToken.user._id });
        return res.status(200).json({
            loggedIn: true,
            user: {
                firstName: loggedInUser.firstName,
                lastName: loggedInUser.lastName,
                email: loggedInUser.email
            }
        })
    })
}

login = async (req, res) => {
    try { 
        const { email, password } = req.body;
        if (!email || !password) {
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });
        }

        const user = await User.findOne({ email: email });
        if (!user) {
            return res
                .status(400)
                .json({ errorMessage: "Wrong email or password." });
        }

        const passwordCorrect = await bcrypt.compare(password, user.passwordHash);
        if (!passwordCorrect) {
            return res
                .status(400)
                .json({
                    errorMessage: "Wrong email or password."
                })
        }

        // LOGIN THE USER
        const token = auth.signToken(user);

        await res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }).status(200).json({
            success: true,
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        }).send();
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
}

logout = async (req, res) => {
    try {
        await res.clearCookie("token").status(200).json({ success: true }).send();
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
}

registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, username, password, passwordVerify } = req.body;
        if (!firstName || !lastName || !email || !username || !password || !passwordVerify) {
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });
        }
        if (password.length < 8) {
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter a password of at least 8 characters."
                });
        }
        if (password !== passwordVerify) {
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter the same password twice."
                })
        }
        const existingUserWithEmail = await User.findOne({ email: email });
        const existingUserWithUsername = await User.findOne({ username: username });
        if (existingUserWithEmail || existingUserWithUsername) {
            return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: "An account with this email address already exists."
                })
        }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName, lastName, email, username, passwordHash
        });
        const savedUser = await newUser.save();

        // LOGIN THE USER
        const token = auth.signToken(savedUser);

        await res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }).status(200).json({
            success: true,
            user: {
                firstName: savedUser.firstName,
                lastName: savedUser.lastName,
                email: savedUser.email,
                username: savedUser.username
            }
        }).send();
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

getUserByEmail = async (req, res) => {
    await User.findOne({ email: req.params.email }, (err, user) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'User not found!',
            })
        }
        return res.status(200).json({ success: true, data: user })
    })
}

module.exports = {
    getLoggedIn,
    registerUser, 
    login,
    logout,
    getUserByEmail
}