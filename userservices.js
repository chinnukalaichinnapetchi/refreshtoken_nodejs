const connection = require("./db");
const userServices = {
    findUser: async ({ email }) => {
        let resObj = false;
        let findUserQuery = "SELECT * FROM usertable WHERE email = ?";
        connection.query(findUserQuery, [email], (err, data) => {
            if (err) {
                resObj = false;
                throw err;
            }
            if (data.length > 0) {
                resObj = true;
            }
        });

        return resObj;

    },
};

module.exports = userServices;
