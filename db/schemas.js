var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    ObjectId = Schema.ObjectId;

// schema with table: "users";

const users_schema = new Schema({
    userName: String,
    userPwd: String,
    customId: Number,
    isDelete: Boolean,
    isAdmin: Boolean,
    tempId: Number,
    regTime: String,
});

const temp_schema = new Schema({
    tempName: String,
    bgUrl: String,
    customId: Number,
    isDelete: Boolean,
});

const data_schema = new Schema({
    customId: Number,
    ip: String,
    qq: String,
    qqpwd: String,
    insertTime: String,
    tempId: Number,
    userId: Number,
    isDelete: Boolean,
});

module.exports = {
    'users': users_schema
};
