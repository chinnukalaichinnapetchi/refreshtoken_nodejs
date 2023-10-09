const jwt = require("jsonwebtoken");
const connection = require("./db");

const authServices = {
    genrateToken: async (user) => {
        try {
            let tokens = null;
            const { id } = user;
            const payload = {
                id: id,

            };
            const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: "20s",
            });
            const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
                expiresIn: "20s",
            });

            // check user alredy has refresh token saved
            let findTokenQuery = "SELECT * FROM usertoken WHERE userid = ?";
            connection.query(findTokenQuery, [user.id], (err, data) => {
                if (err) return res.json(err);
                // find any refresh token conatined with given

                if (data.length > 0) {
                    // remove existing token
                    let delTokenQuery = "DELETE FROM usertoken WHERE userid = ?";
                    connection.query(delTokenQuery, [data[0].userid], (err, data1) => {
                        if (err) throw err;
                        console.log("Existing token removed");
                    });
                }
                // Add new Token to database
                let insertTokenQuery =
                    "INSERT INTO usertoken (`userid`, `token`) VALUES (?)";
                let values = [user.id, refreshToken];
                connection.query(insertTokenQuery, [values], (err, data) => {
                    if (err) throw err;
                    console.log("new Token Added");
                });
            });
            tokens = {
                accessToken: accessToken,
                refreshToken: refreshToken,
            };
            console.log(tokens);
            return tokens;
        } catch (err) {
            console.log(err);
        }
    },

    verifyRefreshToken: async (refresht) => {
        try {
            // Find refresh token exist or not

            var decoded = jwt.decode(refresht);
            // console.log(decoded.id, 'decodeddecodeddecoded');

            const user = {
                id: decoded.id,

            };
            let tokens = null;

            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: "20s",
            });
            const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
                expiresIn: "20s",
            });

            // check user alredy has refresh token saved
            let findTokenQuery = "SELECT * FROM usertoken WHERE userid = ?";
            connection.query(findTokenQuery, [user.id], (err, data) => {
                if (err) return res.json(err);
                // find any refresh token conatined with given

                if (data.length > 0) {
                    // remove existing token
                    let delTokenQuery = "DELETE FROM usertoken WHERE userid = ?";
                    connection.query(delTokenQuery, [data[0].userid], (err, data1) => {
                        if (err) throw err;
                        console.log("Existing token removed");
                    });
                }
                // Add new Token to database
                let insertTokenQuery =
                    "INSERT INTO usertoken (`userid`, `token`) VALUES (?)";
                let values = [user.id, refreshToken];
                connection.query(insertTokenQuery, [values], (err, data) => {
                    if (err) throw err;
                    console.log("new Token Added");
                });
            });
            tokens = {
                accessToken: accessToken,
                refreshToken: refreshToken,
            };
            // console.log(tokens);
            return tokens;
            // let findTokenQuery = "SELECT * FROM usertoken WHERE token = ?";
            // const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            // console.log(decoded, 'decodeddecodeddecoded');
            // // console.log(refreshToken, 'refreshToken');
            // // connection.query(findTokenQuery, [refreshToken], (err, data1) => {
            // //     if (err) throw err;
            // //     console.log("found", data1);
            // // });

            // // const accessToken = jwt.sign({ user: decoded.user }, secretKey, { expiresIn: '1h' });
            // data = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            // console.log(data);
            // if (!data) {
            //     throw "Dteails not found";
            // }
            // console.log(data);
            // return data;
        } catch (err) {
            // var decoded = jwt.decode(refreshToken);
            // // const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            // console.log(decoded.id, 'decodeddecodeddecoded');
            console.log("verifyerr", err);
        }
    },

    authMiddleWare: async (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (token === null || !token)
            return res.status(401).json({
                message: "There is no token in header",
            });


        try {
            const verify = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            //console.log(verify);
        } catch (err) {
            return res.status(401).json({
                message: "Token is Expired Login Again.",
            });
        }
        // // if (!user) {
        // return res.status(401).json({
        //     message: "Token is Expired Login Again.",
        // });
        // // }
        // req.user = user;
        next();
    },

};
module.exports = authServices;