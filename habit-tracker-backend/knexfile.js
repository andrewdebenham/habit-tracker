module.exports = {
    client: 'mysql2',
    connection: {
        host: '127.0.0.1',
        database: process.env.MYSQL_DB,
        user: 'root',
        password: process.env.MYSQL_PASSWORD
    }
}