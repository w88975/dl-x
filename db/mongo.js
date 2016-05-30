var mongoose = require('mongoose'),
    schemas  = require('./schemas'),
    config   = require('./../config.json');
mongoose.connect(config.mongoConnectString);

module.exports = {
    // insert data to tables!
    insert: function(table, data, cb) {
        var _table_instance = new (mongoose.model(table, schemas[table]));
        for (var item in data) {
            _table_instance[item] = data[item];
        }
        _table_instance.save(function(err){cb(err)});
    },

    find: function(table,params,cb) {
        var _model = mongoose.model(table,schemas[table]);
        _model.find(params,function(err,results){cb(err, results)});
    },

    count: function(table,params,cb) {
        var _model = mongoose.model(table,schemas[table]);
        _model.count(params,function(err,results){cb(err,results)});
    },
};
