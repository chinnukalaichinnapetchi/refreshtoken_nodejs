const connection = require("./db");
const bcrypt = require("bcryptjs");
const { findUser } = require("./userservices");
const {
    genrateToken,
    verifyRefreshToken,
    verifyaccessToken,
} = require("./authservices");

let posts = [
    {
        id: 1,
        userId: 1,
        text: "Post 1",
        role: "admin"
    },
    {
        id: 2,
        userId: 1,
        text: "Post 2",
        role: "admin"
    },
    {
        id: 3,
        userId: 2,
        text: "Post 3",
        role: "user"
    },
    {
        id: 4,
        userId: 1,
        text: "Post 4",
        role: "super-admin"
    },
];
const userController = {
    userRegister: async (req, res) => {
        try {
            //find user already exists  or not
            let user = await findUser({
                email: req.body.email,
            });
            if (user) {
                return res.status(403).json({
                    message: "User Already Exists.",
                });
            }
            if (user) {
                return res.status(403).json({
                    message: "User Already Exists.",
                });
            }
            // Not exist then create a recoerd in to user
            const { username, email, userpassword } = req.body;

            let insetUserQuery =
                "INSERT INTO usertable (`username`, `email`, `userpassword`) VALUES (?)";

            const salt = bcrypt.genSaltSync(10);
            const hashPassword = bcrypt.hashSync(userpassword, salt);
            let values = [username, email, hashPassword];

            connection.query(insetUserQuery, [values], (err, data) => {
                if (err) res.json(err);
                return res.status(200).json({
                    message: "User Created Successfully",
                    data: data,
                });

            });

        } catch (err) {

            return res.status(500).json({
                message: "Server Error",
                data: err,
            });
        }
    },
    userLogin: async (req, res) => {
        try {
            //Find User
            let findUserQuery = "SELECT * FROM usertable WHERE email = ?";
            connection.query(findUserQuery, [req.body.email], (err, data) => {
                if (err) {
                    res.json(err);

                }
                // User found
                if (data.length <= 0) {
                    return res.status(409).json({ message: "User does not Exists" });
                }
                const salt = bcrypt.genSaltSync(10);
                const hashPassword = bcrypt.hashSync(req.body.userpassword, salt);
                const checkPassword = bcrypt.compareSync(
                    String(req.body.userpassword),
                    String(data[0].userpassword)
                );
                if (!checkPassword) {
                    return res.status(400).json({
                        message: "Worng Username and Password",
                    });
                }

                const user = {
                    id: data[0].userid,

                };
                genrateToken(user).then((data) => {
                    return res.status(200).json({
                        tokens: data,
                        message: "User Login Sucessfull",
                    });
                });
            });
        } catch (err) {
            return res.status(500).json({
                message: "Server Error",
                data: err,
            });
        }
    },

    getNewAcessToken: async (req, res) => {
        try {
            verifyRefreshToken(req.body.refreshToken).then((data) => {
                return res.status(200).json({
                    message: "Token Refreshed",
                    data: data,
                });
            });
        } catch (err) {
            return res.status(500).json({
                message: "Server Error",
                data: err,
            });
        }
    },
    userLogout: async (req, res) => {
        try {
            // Find Token And Remove It from Database
            let delTokenQuery = "DELETE FROM usertoken WHERE token = ?";
            connection.query(delTokenQuery, [req.body.refreshToken], (err, data) => {
                if (err) throw err;
                return res.status(200).json({
                    message: "User Logout Sucessfully",
                });
            });
        } catch (err) {
            return res.status(500).json({
                message: "Server Error",
                data: err,
            });
        }
    },
    addPost: async (req, res) => {
        try {
            let filtedPost = posts.filter(item => item.userId === 1);
            if (filtedPost)
                return res.status(200).json(filtedPost);
        } catch (err) {
            return res.status(500).json({
                message: "Server Error",
                data: err,
            });
        }
    }
};

module.exports = userController;