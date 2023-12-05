const { Sequelize } = require('sequelize');

// Initialize the sequelize instance
const sequelize = new Sequelize('testDB', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql'
});


async function connectToDatabase() {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ force: false });
        console.log('Connection established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

const initialize = async () => {
    await connectToDatabase();
};

initialize();

module.exports = {
    sequelize
};
