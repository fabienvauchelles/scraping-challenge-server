'use strict';

const _ = require('lodash'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;


const schema = new Schema({
    // _id => implicit

    url: String,

    pclass: Number,
    crew: Boolean,

    honorific_prefix: String,
    given_name: String,
    family_name: String,

    birth_year: Number,
    death_year: Number,

    gender: String,

    marital_status: String,
    spouse: String,

    last_residence_city: String,
    last_residence_state: String,
    last_residence_country: String,

    job: String,

    crew_last_ship: String,

    first_embarked_place: String,

    ticket_num: String,
    ticket_fare: Number,

    cabin: String,

    destination_city: String,
    destination_state: String,
    destination_country: String,

    died_in_titanic: Boolean,
    body_recovered: Boolean,
    rescue_boat_num: String,

    companions_count: Number,
});


module.exports = mongoose.model('Persons', schema);
