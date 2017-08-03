var router = require('express').Router(),
    fs = require('fs'),
    path = require('path'),
    config = require('../../../config/default.js'),
    authMiddleware = require('../../middleware/auth.js');

function handler(req, res) {
    var modelName = req.params.model;
    if (
        modelName &&
        fs.existsSync(
            path.join(
                __dirname,
                '../../db/model/' +
                modelName.charAt(0).toUpperCase() +
                modelName.slice(1) +
                '.js'
            )
        )
    ) {
        var model = require('../../db/model/' +
            modelName.charAt(0).toUpperCase() +
            modelName.slice(1) +
            '.js');
        var form = {};

        if (req.params.submodel) {
            if (req.params.submodel in model.schema.obj) {
                var submodel = model.schema.obj[req.params.submodel];

                submodel.form.forEach(function(prop) {
                    var org_prop = prop;

                    if (prop.key in model.schema.obj) {
                        prop = model.schema.obj[prop.key];
                    } else {
                        prop.form = JSON.parse(JSON.stringify(prop));
                    }

                    console.log(org_prop, prop);

                    var prop_res = {};

                    if (req.groups) {
                        prop_res = check_types(prop, req.groups);
                    } else {
                        prop_res = check_types(prop);
                    }

                    if (prop_res) {
                        form[org_prop.key] = prop_res;
                    }
                });
            } else {
                delete req.params.submodel;
                return handler(req, res);
            }
        } else {
            for (var prop in model.schema.obj) {
                var prop_val = model.schema.obj[prop];
                var prop_res = {};

                if (req.groups) {
                    prop_res = check_types(prop_val, req.groups);
                } else {
                    prop_res = check_types(prop_val);
                }

                if (prop_res) {
                    form[prop] = prop_res;
                }
            }
        }

        res.send({
            status: true,
            types: config.form_types,
            form: form
        });
    } else {
        res.send({
            status: false,
            message: 'Model: ' + modelName + ' not found'
        });
    }
}

router.get('/:model', authMiddleware('any', 'api', false, undefined, false), handler);
router.get('/:model/:submodel', authMiddleware('any', 'api', false, undefined, false), handler);

function check_types(prop_val, groups) {
    if (Array.isArray(prop_val) || !prop_val.form) {
        return undefined;
    }

    var inGroup = false;
    if (groups) {
        groups.forEach(function(group) {
            if (
                'auth_groups' in prop_val.form &&
                prop_val.form.auth_groups.indexOf(group) !== -1
            ) {
                inGroup = true;
            }
        });
    }

    if (!inGroup && !prop_val.form.user_editable && prop_val.form.type_override !== 'sectionheader' && prop_val.form.type_override !== 'submit') {
        return undefined;
    }

    var type = prop_val;
    var val_types = {};

    if ('type' in prop_val) {
        type = prop_val.type;

        if ('type_override' in prop_val.form) {
            type = prop_val.form.type_override;
        }
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
        case 'essay':
            val_types.type = config.form_types.ESSAY;
            break;
        case 'sectionheader':
            val_types.type = config.form_types.SECTIONHEADER;
            break;
        case 'submit':
            val_types.type = config.form_types.SUBMIT;
            break;
    }

    if ('enum' in prop_val) {
        var select = [];
        prop_val.enum.forEach(function(data, elem) {
            select.push({ label: prop_val.form.select[elem], value: data });
        });

        val_types.type = config.form_types.SELECT;
        val_types.select = select;
    }

    if (prop_val.form.label) {
        val_types.label = prop_val.form.label;
    }

    if ('wideLabel' in prop_val.form) {
        val_types.wideLabel = prop_val.form.wideLabel;
    }

    if (prop_val.form.placeholder) {
        val_types.placeholder = prop_val.form.placeholder;
    }

    if (prop_val.form.array_select) {
        val_types.array_select = prop_val.form.array_select;
    }

    val_types.required = prop_val.required || false;

    return val_types;
}

module.exports = router;
