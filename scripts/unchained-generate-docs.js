process.env.START_SERVER = false;
process.env.DEBUG = '';
const util = require('util'),
    _ = require('lodash'),
    main = require('../app.js'),
    app = main.app,
    mongoose = main.mongoose,
    doc = {
        openapi: '3.0.0',
        info: {
            description: 'The Unchained MHacks API',
            version: '0.0.1',
            title: 'MHacks',
            termsOfService: 'https://mhacks.org',
            contact: {
                email: 'hackathon-tech@umich.edu'
            },
            license: {
                name: 'GNU General Public License v3.0',
                url: 'https://github.com/mhacks/mhacks-web/blob/master/LICENSE'
            }
        },
        servers: [
            {
                url: 'https://mhacks.org/v1',
                description: 'Production'
            },
            {
                url: 'https://staging.mhacks.org/v1',
                description: 'Staging'
            },
            {
                url: 'http://localhost:3000/v1',
                description: 'Development'
            }
        ],
        tags: [
            {
                name: 'default',
                description: 'default'
            }
        ],
        paths: {
            '/default': {
                post: {
                    tags: [
                        'default'
                    ],
                    summary: 'default',
                    description: '',
                    operationId: 'default',
                    consumes: [
                        'application\/json',
                        'application\/xml'
                    ],
                    produces: [
                        'application\/xml',
                        'application\/json'
                    ],
                    parameters: [
                        {
                            in: 'default',
                            name: 'default',
                            description: 'default',
                            required: true,
                            schema: {
                                $ref: '#\/definitions\/default'
                            }
                        }
                    ],
                    responses: {
                        '405': {
                            description: 'default'
                        }
                    },
                    security: [
                        {
                            bearerAuth: []
                        }
                    ]
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ],
        components: {
            schemas: {
                default: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            format: 'int64'
                        },
                        petId: {
                            type: 'integer',
                            format: 'int64'
                        },
                        quantity: {
                            type: 'integer',
                            format: 'int32'
                        },
                        shipDate: {
                            type: 'string',
                            format: 'date-time'
                        },
                        status: {
                            type: 'string',
                            description: 'Order Status',
                            enum: [
                                'placed',
                                'approved',
                                'delivered'
                            ]
                        },
                        complete: {
                            type: 'boolean',
                            default: false
                        }
                    }
                }
            },
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        },
    };

doc.tags = [];
doc.paths = {};
doc.components.schemas = {
    Auth: {
        type: 'object',
        properties: {
            full_name: {
                type: 'string',
                description: 'Full Name'
            },
            email: {
                type: 'string',
                format: 'email',
                description: 'Email'
            },
            password: {
                type: 'string',
                format: 'password',
                description: 'Password'
            }
        }
    },
    Email: {
        type: 'object',
        properties: {
            email: {
                type: 'string',
                format: 'email',
                description: 'Email'
            }
        }
    },
    Deploy: {
        type: 'object',
        properties: {

        }
    },
    Admin: {
        type: 'object',
        properties: {

        }
    },
    Reader: {
        type: 'object',
        properties: {

        }
    },
    Push: {
        type: 'object',
        properties: {

        }
    },
    Artifact: {
        type: 'object',
        properties: {

        }
    },
    Form: {
        type: 'object',
        properties: {

        }
    },
};

const routes = {};
const cleanRoutes = {};

function recurseStacks(middleware, title) {
    if (middleware.handle && middleware.handle.name === 'router') {
        middleware.handle.stack.forEach(function(param) {
            recurseStacks(param, title.concat([middleware.regexp.source.replace('^\\', '').replace('\\/?(?=\\/|$)', '').replace('?(?=\\/|$)', '')]));
        });
    } else if (middleware.route && middleware.route.path) {
        let fullPath = title.concat([middleware.route.path]);
        _.set(routes, fullPath, Object.keys(middleware.route.methods).concat(_.get(routes, fullPath, [])));

        var newPath = fullPath.join('').replace('//', '/');
        if (newPath.substr(-1) === '/') {
            newPath = newPath.substr(0, newPath.length - 1);
        }
        cleanRoutes[newPath] = _.get(routes, fullPath, []);
    }
}

app._router.stack.forEach(function(param) {
    recurseStacks(param, []);
});

for (const modelName in mongoose.modelSchemas) {
    if (mongoose.modelSchemas.hasOwnProperty(modelName)) {
        const model = mongoose.modelSchemas[modelName],
            definition = {
                type: 'object',
                properties: {
                    id: {
                        type: 'string',
                        description: 'The id of the document'
                    },
                    createdAt: {
                        type: 'string',
                        format: 'date-time',
                    },
                    updatedAt: {
                        type: 'string',
                        format: 'date-time',
                    }
                }
            };

        for (const prop in model.obj) {
            if (model.obj.hasOwnProperty(prop)) {
                const prop_val = model.obj[prop];
                let type = prop_val.type,
                    label = prop_val.label || '',
                    defaultValue = (prop_val.default !== undefined ? prop_val.default : '');

                if (prop_val.form) {
                    if (prop_val.form.type_override) {
                        type = prop_val.form.type_override;
                    }

                    if (prop_val.form.label) {
                        label = prop_val.label;
                    }

                    if (prop_val.form.default) {
                        defaultValue = prop_val.form.default;
                    }
                }

                let prop_def_obj = {
                    description: label,
                    default: defaultValue
                };

                switch (type) {
                    case String:
                        prop_def_obj = {
                            type: 'string'
                        };
                        break;
                    case Boolean:
                        prop_def_obj = {
                            type: 'boolean'
                        };
                        break;
                    case Date:
                        definition.properties[prop + '_ts'] = {
                            type: 'number',
                            format: 'integer'
                        };
                        prop_def_obj = {
                            type: 'string',
                            format: 'date-time'
                        };
                        break;
                    case Number:
                        prop_def_obj = {
                            type: 'number'
                        };
                        break;
                    case Buffer:
                        prop_def_obj = {
                            type: 'buffer'
                        };
                        break;
                    case Array:
                    case 'array':
                        prop_def_obj = {
                            type: 'array'
                        };
                        break;
                    case 'essay':
                        prop_def_obj = {
                            type: 'string'
                        };
                        break;
                    case 'sectionheader':
                        break;
                    case 'submit':
                        break;
                    case 'file':
                        prop_def_obj = {
                            type: 'string',
                            format: 'binary'
                        };
                        break;
                }

                if ('enum' in prop_val) {
                    prop_def_obj.enum = prop_val.enum;
                }

                definition.properties[prop] = prop_def_obj;
            }
        }

        //doc.tags.push({name: modelName, description: modelName});
        doc.components.schemas[modelName] = definition;
    }
}


for (const route in cleanRoutes) {
    if (route.substr(0, 4) === '/v1/') {
        const routeParts = route.split('/');
        doc.paths[route] = {};

        let specialTag = false,
            tag = routeParts[2].charAt(0).toUpperCase() + routeParts[2].slice(1),
            responseProp = tag;

        if (tag === 'Mentor' || tag === 'Speaker') {
            tag += 'Application';
            responseProp = 'application';
        }

        if (routeParts[3]) {
            const testSpecialTag = tag + routeParts[3].charAt(0).toUpperCase() + routeParts[3].slice(1);

            if (testSpecialTag in doc.components.schemas) {
                specialTag = testSpecialTag;
            }
        }

        cleanRoutes[route].forEach(function(method) {
            doc.paths[route][method] = {
                tags: [
                    tag
                ],
                summary: '',
                description: '',
                operationId: method + routeParts.slice(2).map(function(elem) { return elem.charAt(0).toUpperCase() + elem.slice(1) }).join(''),
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/' + (specialTag || (tag.substr(-1) === 's' ? tag.substr(0, tag.length - 1) : tag))
                            },
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Okay',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        status: {
                                            type: 'boolean',
                                            description: 'Whether or not the request was successful'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '401': {
                        description: 'Unauthorized'
                    },
                    '400': {
                        description: 'Bad Request'
                    },
                    '500': {
                        description: 'Internal Server Error (Unknown Error)'
                    }
                },
                security: [
                    {
                        bearerAuth: []
                    }
                ]
            };

            doc.paths[route][method].responses['200'].content['application/json'].schema.properties[responseProp.toLowerCase()] = {
                $ref: '#/components/schemas/' + (specialTag || (tag.substr(-1) === 's' ? tag.substr(0, tag.length - 1) : tag))
            };

            if (['get'].indexOf(method) !== -1) {
                delete doc.paths[route][method].requestBody;
            }
        });3
    }
}

console.log(JSON.stringify(doc, null, 4));

process.exit();