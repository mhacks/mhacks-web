var router = require('express').Router(),
    fs = require('fs'),
    path = require('path'),
    config = require('../../../config/default.js'),
    authMiddleware = require('../../middleware/auth.js');

// Handles both routes
function handler(req, res) {
    // Check if the requested model exists
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

        // Check if there is a submodel for this form
        if (req.params.submodel) {
            if (req.params.submodel in model.schema.obj) {
                var submodel = model.schema.obj[req.params.submodel];

                // Go through each submodel form property
                submodel.form.forEach(function(prop) {
                    var org_prop = prop;

                    // Check if the key exists in the parent model, if it does, use the parent models form value
                    if (prop.key in model.schema.obj) {
                        prop = Object.assign(
                            {},
                            model.schema.obj[prop.key],
                            org_prop
                        );
                    } else {
                        prop.form = JSON.parse(JSON.stringify(prop));
                    }

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

// Routes use the authMiddleware to initialize request tokens/groups without stopping logged out users
router.get(
    '/:model',
    authMiddleware('any', 'api', false, undefined, false),
    handler
);
router.get(
    '/:model/:submodel',
    authMiddleware('any', 'api', false, undefined, false),
    handler
);

// Check the type on the schema value for a form
function check_types(prop_val, groups) {
    // Don't include if it's an array or doesn't contain the form object
    if (Array.isArray(prop_val) || !prop_val.form) {
        return undefined;
    }

    // Check if the user is in the auth_groups for the schema value
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

    // Check if anything is satisfied
    if (
        !inGroup &&
        !prop_val.form.user_editable &&
        prop_val.form.type_override !== 'sectionheader' &&
        prop_val.form.type_override !== 'submit'
    ) {
        return undefined;
    }

    var type = prop_val;
    var val_types = {};

    // Set the type or override it by a form understandable one
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
        case 'array':
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
        case 'file':
            val_types.type = config.form_types.FILE;
            break;
    }

    // If there's an enum, it's a select group
    if ('enum' in prop_val && prop_val.enum) {
        var select = [];
        prop_val.enum.forEach(function(data, elem) {
            select.push({ label: prop_val.form.select[elem], value: data });
        });

        val_types.type = config.form_types.SELECT;
        val_types.select = select;
    }

    // Set form attributes
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
