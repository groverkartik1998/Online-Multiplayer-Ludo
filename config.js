const secret = Math.random().toString(36).substring(7);
const port = process.env.PORT || 8082;

module.exports = {
    secret,
    lobbyTimeout: 10000,
    lobbyTimeoutCheckInterval: 5000,
    port: port,
    baseUrl: '/'       //For use with reverse proxies.
};
