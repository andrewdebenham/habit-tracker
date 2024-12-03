module.exports = {
    client: 'mysql2',
    connection: {
        host: '127.0.0.1',
        database: 'habit_tracker',
        user: 'root',
        password: process.env.MYSQL_PASSWORD // need to import from .env
    }
}