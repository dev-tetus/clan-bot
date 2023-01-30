const client = require("../index");


client.on("ready", async () => {

    console.log('Bot ready!');
});
process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);

});