const { StatusCodes } = require("http-status-codes");
const S = require("fluent-json-schema");
const db = require("../models");
const { Sequelize, sequelize } = db;
const { ValidationError, DatabaseError, Op } = Sequelize;
const { Location, Weather, Warning } = require("../models");
// const { /* modellek importálása itt */ } = db;

module.exports = function (fastify, opts, next) {
    // http://127.0.0.1:4000/
    fastify.get("/", async (request, reply) => {
        reply.send({ message: "Gyökér végpont" });

        // NOTE: A send alapból 200 OK állapotkódot küld, vagyis az előző sor ugyanaz, mint a következő:
        // reply.status(200).send({ message: "Gyökér végpont" });

        // A 200 helyett használhatsz StatusCodes.OK-ot is (így szemantikusabb):
        // reply.status(StatusCodes.OK).send({ message: "Gyökér végpont" });
    });

    // http://127.0.0.1:4000/auth-protected
    fastify.get("/auth-protected", { onRequest: [fastify.auth] }, async (request, reply) => {
        reply.send({ user: request.user });
    });


    fastify.get(
        "/locations",
        async (request, reply) => {
            const locations = await Location.findAll();
            return reply.status(200).send(locations);
        }
    );

    fastify.get(
        "/locations/:id",
        {
            schema: {
                params: {
                    type: "object",
                    properties: {
                        id: { type: "integer" },
                    },
                },
            },
        },
        async (request, reply) => {
            const location = await Location.findByPk(request.params.id);
            if (!location) return reply.status(404).send({ message: "Location not found." });
            return reply.status(200).send(location);
        }
    );

    fastify.post(
        "/locations",
        {
            schema: {
                body: {
                    type: "object",
                    required: ["name", "lat", "lon"],
                    properties: {
                        name: { type: "string" },
                        lat: { type: "number" },
                        lon: { type: "number" },
                        public: { type: "boolean", nullable: true, default: true }
                    },
                },
            },
        },
        async (request, reply) => {
            if (await Location.findByPk(request.params.id) != null) { return reply.status(500); }
            const location = await Location.create(request.body);
            return reply.status(201).send(location);
        }
    );

    fastify.delete(
        "/locations/:id",
        {
            schema: {
                params: {
                    type: "object",
                    properties: {
                        id: { type: "integer" },
                    },
                },
            },
        },
        async (request, reply) => {
            const location = await Location.findByPk(request.params.id);
            if (!location) return reply.status(404).send({ message: "Location not found." });
            await location.destroy();
            return reply.status(200).send();
        }
    );

    fastify.post(
        "/login",
        {
            schema: {
                body: {
                    type: "object",
                    required: ["email"],
                    properties: {
                        email: { type: "string" },
                    },
                },
            },
        },
        async (request, reply) => {
            const id = request.body.email.substr(8,request.body.email.split('@')[0].length-8);
            if (!(request.body.email.split('@')[1] === "weather.org"
            && !isNaN(id)
            && (request.body.email).substr(0, 8) === "location"))
            {
                return reply.status(418).send();
            }

            const location = await Location.findByPk(id);
            if (!location) return reply.status(404).send({ message: "Location not found." });

            const token = fastify.jwt.sign(location.toJSON())

            return reply.status(200).send({ token });
        }
    );

    next();
};

module.exports.autoPrefix = "/";
