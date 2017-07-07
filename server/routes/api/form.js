var router = require('express').Router(),
    fs = require('fs'),
    path = require('path'),
    config = require('../../../config/default.js');

router.get('/:model', function(req, res) {
    var modelName = req.params.model;
    if (modelName && fs.existsSync(path.join(__dirname, '../../db/model/' + modelName.charAt(0).toUpperCase() + modelName.slice(1) + '.js'))) {
        var model = require('../../db/model/' + modelName.charAt(0).toUpperCase() + modelName.slice(1) + '.js');
        var form = {};

        for (var prop in model.schema.obj) {
            var prop_val = model.schema.obj[prop];
            var prop_res = check_types(prop_val);

            if (prop_res) {
                form[prop] = prop_res;
            }
        }

        res.send({
            status: true,
            types: config.form_types,
            form: form
        })
    } else {
        res.send({
            status: false,
            message: 'Model: ' + modelName + ' not found'
        });
    }
});

function check_types(prop_val) {
    if (Array.isArray(prop_val) || !prop_val.user_editable) {
        return undefined;
    }

    var type = prop_val;
    var val_types = {};

    if ('type' in prop_val) {
        type = prop_val.type;
    }

    switch (type) {
        case String:
            val_types.type = config.form_types.TEXT;
            break;
        case Boolean:
            val_types.type = config.form_types.BOOLEAN;
            break;
        case Date:
            val_types.type = config.form_types.DATE;
            break;
        case Number:
            val_types.type = config.form_types.NUMBER;
            break;
        case Buffer:
            val_types.type = config.form_types.BUFFER;
            break;
        case Array:
            val_types.type = config.form_types.ARRAY;
            break;
    }

    if ('enum' in prop_val) {
        val_types.enum = prop_val.enum;
        val_types.type = config.form_types.SELECT
    }

    return val_types;
}

module.exports = router;
