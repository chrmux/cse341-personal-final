export const PORT = 8080;
export const environment = {
    development: {
        serverURL: `http://localhost:${PORT}/`,
        dbString: 'mongodb://0.0.0.0:27017/'
    },
    production: {
        serverURL: `http://localhost:${PORT}/`,
        dbString: 'mongodb://0.0.0.0:27017/'
    }
}