const { client } = require("./db");

const init = async () => {
    await client.connect();
};
init();
