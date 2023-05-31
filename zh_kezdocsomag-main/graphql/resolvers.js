const auth = require("./auth");
const db = require("../models");
const { Sequelize, sequelize } = db;
const { ValidationError, DatabaseError, Op } = Sequelize;
const { Location, Weather, Warning } = db;

module.exports = {
    Query: {
        // Elemi Hello World! példa:
        helloWorld: () => "Hello World!",

        // Példa paraméterezésre:
        helloName: (_, { name }) => `Hello ${name}!`,

        locations: async () => await Location.findAll(),
        weather: async () => await Weather.findAll(),

        location: async (_, { id }) =>
            await Location.findOne({
                where: {
                    id: {
                        [Op.eq]: id,
                    },
                }
            }),
    },

    Mutation: {
        createWeather: async (_, { input }) => await Weather.create(input)
    }
};
