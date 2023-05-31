"use strict";

// Faker dokumentáció, API referencia: https://fakerjs.dev/guide/#node-js
const { faker } = require("@faker-js/faker");
const chalk = require("chalk");
const { Location, Weather, Warning } = require("../models");

module.exports = {
    up: async (queryInterface, Sequelize) => {
            const locationCount = faker.datatype.number({min: 10, max: 20});
            const locations = [];

            for (let i = 0; i < locationCount; i++)
            {
                locations.push(
                    await Location.create(
                        {
                            name: faker.helpers.unique(faker.address.city),
                            lat: faker.address.latitude(),
                            lon: faker.address.longitude(),
                            public: (faker.datatype.boolean() ? null : faker.datatype.boolean())
                        }
                    )
                );
            }


            const weatherCount = [];
            const weather = [];

            for (let i = 0; i < locationCount; i++)
            {
                let count = faker.datatype.number({min:5, max:10});
                weatherCount.push(count);
                for (let j = 0; j < count; j++)
                {
                    weather.push(
                        await Weather.create({
                            type: faker.helpers.arrayElement(['sunny', 'cloudy', 'rain', 'storm']),
                            LocationId: locations[i],
                            temp: faker.datatype.float({min: -10, max:30}),
                            loggedAt: faker.date.between({from: '1970-01-01T00:00:00.000Z', to: '2020-01-01T00:00:00.000Z'})
                        })
                    );
                }
            }

            const warningCount = [];
            let warnings = [];

            for (let i = 0; i < weather.length; i++)
            {
                let count = faker.datatype.number({min: 1, max: 5})
                warningCount.push(count);
                for (let j = 0; j < count; j++)
                {
                    warnings.push(
                        await Warning.create({
                            level: faker.datatype.number({min: 1, max: 3}),
                            message: (faker.datatype.boolean() ? null : faker.lorem.lines(2))
                        })
                    )
                }

                weather[i].setWarnings(warnings);
                warnings = [];
            }

            console.log(chalk.green("A DatabaseSeeder lefutott"));
    },

    // Erre alapvetően nincs szükséged, mivel a parancsok úgy vannak felépítve,
    // hogy tiszta adatbázist generálnak, vagyis a korábbi adatok enélkül is elvesznek
    down: async (queryInterface, Sequelize) => {},
};
