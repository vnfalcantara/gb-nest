import { OpenAPIObject } from "@nestjs/swagger";

export const OpenAPI: OpenAPIObject = {
    "openapi": "3.0.0",
    "info": {
        "title": "GB-NEST",
        "description": "",
        "version": "0.0.1",
        "contact": {

        }
    },
    "tags": [

    ],
    "servers": [

    ],
    "components": {

        "securitySchemes": {
            "bearerAuth": {
                "type": "http",
                "scheme": "bearer",
                "bearerFormat": "JWT"
            }
        },

        "schemas": {
            "Login": {
                "type": 'object',
                "properties": {
                    "email": { "type": 'string', example: "user@email.com" },
                    "password": { "type": 'string', example: "123456" }
                }
            },
            "UserBody": {
                "type": 'object',
                "properties": {
                    "name": { "type": 'string' },
                    "cpf": { "type": 'string' },
                    "email": { "type": 'string' },
                    "password": { "type": 'string' }
                }
            },

            "User": {
                "type": 'object',
                "properties": {
                    "_id": { type: "string" },
                    "name": { "type": 'string' },
                    "cpf": { "type": 'string' },
                    "email": { "type": 'string' },
                    "password": { "type": 'string' },
                    "deleted": { type: "boolean" },
                    "created_at": { type: "date" },
                }
            },

            "PurchaseBody": {
                "type": "object",
                "properties": {
                    "code": { type: 'string' },
                    "price": { type: 'number' }
                }
            },

            "Purchase": {
                "type": "object",
                "properties": {
                    "_id": { type: "string" },
                    "code": { type: 'string' },
                    "price": { type: 'number' },
                    "deleted": { type: "boolean" },
                    "status": { type: "string" },
                    "cashbackValue": { type: "number" },
                    "cashback": { type: "number" },
                    "dealer": { type: "string" },
                    "added_to_queue": { type: "date" },
                    "created_at": { type: "date" },
                }
            }
        },

        "parameters": {
            "idParam": {
                "name": "id",
                "in": "path",
                "description": "ID do documento",
                "required": true,
                "schema": {
                    "type": "string"
                }
            },
            "matchName": {
                "name": "match[name]",
                "in": "query",
                "description": "",
                "required": false,
                "schema": {
                    "type": "string"
                }
            },
            "matchEmail": {
                "name": "match[email]",
                "in": "query",
                "description": "",
                "required": false,
                "schema": {
                    "type": "string"
                }
            },
            "matchCpf": {
                "name": "match[cpf]",
                "in": "query",
                "description": "",
                "required": false,
                "schema": {
                    "type": "string"
                }
            },
            "fieldsName": {
                "name": "fields[name]",
                "in": "query",
                "description": "",
                "required": false,
                "schema": {
                    "type": "string"
                }
            },
            "fieldsEmail": {
                "name": "fields[email]",
                "in": "query",
                "description": "",
                "required": false,
                "schema": {
                    "type": "string"
                }
            },
            "fieldsCpf": {
                "name": "fields[cpf]",
                "in": "query",
                "description": "",
                "required": false,
                "schema": {
                    "type": "string"
                }
            },


            "matchCode": {
                "name": "match[code]",
                "in": "query",
                "description": "",
                "required": false,
                "schema": {
                    "type": "string"
                }
            },
            "matchStatus": {
                "name": "match[status]",
                "in": "query",
                "description": "",
                "required": false,
                "schema": {
                    "type": "string"
                }
            },
            "matchDealer": {
                "name": "match[dealer]",
                "in": "query",
                "description": "",
                "required": false,
                "schema": {
                    "type": "string"
                }
            },
            "fieldsCode": {
                "name": "fields[code]",
                "in": "query",
                "description": "",
                "required": false,
                "schema": {
                    "type": "string"
                }
            },
            "fieldsStatus": {
                "name": "fields[status]",
                "in": "query",
                "description": "",
                "required": false,
                "schema": {
                    "type": "string"
                }
            },
            "fieldsDealer": {
                "name": "fields[dealer]",
                "in": "query",
                "description": "",
                "required": false,
                "schema": {
                    "type": "string"
                }
            },


            "sortParam": {
                "name": "options[sort]",
                "in": "query",
                "description": "Ordenar por campo",
                "required": false,
                "schema": {
                    "type": "string"
                }
            },
            "skipParam": {
                "name": "options[skip]",
                "in": "query",
                "description": "Quantidade de dados ignorados",
                "required": false,
                "schema": {
                    "type": "integer",
                    "format": "int32"
                }
            },
            "limitParam": {
                "name": "options[limit]",
                "in": "query",
                "description": "Quantidade máxima de dados retornados",
                "required": false,
                "schema": {
                    "type": "integer",
                    "format": "int32"
                }
            }
        }
    },
    "paths": {
        "/auth/login": {
            "post": {
                "operationId": "AuthController_login",
                "parameters": [

                ],
                "requestBody": {
                    "required": true,
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/Login"
                            }
                        }
                    }
                },
                "responses": {
                    "201": {
                        "description": ""
                    }
                }
            }
        },
        "/auth/profile": {
            "get": {
                "security": [{ "bearerAuth": [] }],
                "operationId": "AuthController_profile",
                "parameters": [

                ],
                "responses": {
                    "200": {
                        "description": ""
                    }
                }
            }
        },


        "/user": {
            "post": {
                "security": [{ "bearerAuth": [] }],
                "operationId": "UserController_create",
                "parameters": [

                ],
                "requestBody": {
                    "required": true,
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/UserBody"
                            }
                        }
                    }
                },
                "responses": {
                    '201': {
                        "description": "Lista de usuários.",
                        "content": {
                            'application/json': {
                                "schema": {
                                    "type": 'object',
                                    "items": { '$ref': '#/components/schemas/User' }
                                }
                            }
                        }
                    }
                }
            },
            "get": {
                "security": [{ "bearerAuth": [] }],
                "operationId": "UserController_findAll",
                "parameters": [
                    { "$ref": "#/components/parameters/matchName" },
                    { "$ref": "#/components/parameters/matchEmail" },
                    { "$ref": "#/components/parameters/matchCpf" },
                    { "$ref": "#/components/parameters/fieldsName" },
                    { "$ref": "#/components/parameters/fieldsEmail" },
                    { "$ref": "#/components/parameters/fieldsCpf" },
                    { "$ref": "#/components/parameters/sortParam" },
                    { "$ref": "#/components/parameters/skipParam" },
                    { "$ref": "#/components/parameters/limitParam" }
                ],
                "responses": {
                    '200': {
                        "description": "Lista de usuários.",
                        "content": {
                            'application/json': {
                                "schema": {
                                    "type": 'array',
                                    "items": { '$ref': '#/components/schemas/User' }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/user/count": {
            "get": {
                "security": [{ "bearerAuth": [] }],
                "operationId": "UserController_count",
                "parameters": [
                    { "$ref": "#/components/parameters/matchName" },
                    { "$ref": "#/components/parameters/matchEmail" },
                    { "$ref": "#/components/parameters/matchCpf" },
                ],
                "responses": {
                    "200": {
                        "description": ""
                    }
                }
            }
        },
        "/user/{id}": {
            "get": {
                "security": [{ "bearerAuth": [] }],
                "operationId": "UserController_findOne",
                "parameters": [
                    { "$ref": "#/components/parameters/idParam" },

                    { "$ref": "#/components/parameters/fieldsName" },
                    { "$ref": "#/components/parameters/fieldsEmail" },
                    { "$ref": "#/components/parameters/fieldsCpf" },
                ],
                "responses": {
                    '200': {
                        "description": "Lista de usuários.",
                        "content": {
                            'application/json': {
                                "schema": {
                                    "type": 'object',
                                    "items": { '$ref': '#/components/schemas/User' }
                                }
                            }
                        }
                    }
                }
            },
            "put": {
                "security": [{ "bearerAuth": [] }],
                "operationId": "UserController_update",
                "parameters": [
                    { "$ref": "#/components/parameters/idParam" }
                ],
                "requestBody": {
                    "required": true,
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/UserUpdate"
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": ""
                    }
                }
            },
            "delete": {
                "security": [{ "bearerAuth": [] }],
                "operationId": "UserController_remove",
                "parameters": [
                    { "$ref": "#/components/parameters/idParam" }
                ],
                "responses": {
                    "200": {
                        "description": ""
                    }
                }
            }
        },

        "/purchase": {
            "post": {
                "security": [{ "bearerAuth": [] }],
                "operationId": "PurchaseController_create",
                "parameters": [

                ],
                "requestBody": {
                    "required": true,
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/Purchase"
                            }
                        }
                    }
                },
                "responses": {
                    '201': {
                        "description": "Lista de usuários.",
                        "content": {
                            'application/json': {
                                "schema": {
                                    "type": 'object',
                                    "items": { '$ref': '#/components/schemas/Purchase' }
                                }
                            }
                        }
                    }
                }
            },
            "get": {
                "security": [{ "bearerAuth": [] }],
                "operationId": "PurchaseController_findAll",
                "parameters": [
                    { "$ref": "#/components/parameters/matchCode" },
                    { "$ref": "#/components/parameters/matchStatus" },
                    { "$ref": "#/components/parameters/matchDealer" },
                    { "$ref": "#/components/parameters/fieldsCode" },
                    { "$ref": "#/components/parameters/fieldsStatus" },
                    { "$ref": "#/components/parameters/fieldsDealer" },
                    { "$ref": "#/components/parameters/sortParam" },
                    { "$ref": "#/components/parameters/skipParam" },
                    { "$ref": "#/components/parameters/limitParam" }
                ],
                "responses": {
                    '200': {
                        "description": "Lista de usuários.",
                        "content": {
                            'application/json': {
                                "schema": {
                                    "type": 'array',
                                    "items": { '$ref': '#/components/schemas/Purchase' }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/purchase/count": {
            "get": {
                "security": [{ "bearerAuth": [] }],
                "operationId": "PurchaseController_count",
                "parameters": [
                    { "$ref": "#/components/parameters/matchCode" },
                    { "$ref": "#/components/parameters/matchStatus" },
                    { "$ref": "#/components/parameters/matchDealer" },
                ],
                "responses": {
                    "200": {
                        "description": ""
                    }
                }
            }
        },
        "/purchase/{id}": {
            "get": {
                "security": [{ "bearerAuth": [] }],
                "operationId": "PurchaseController_findOne",
                "parameters": [
                    { "$ref": "#/components/parameters/idParam" },

                    { "$ref": "#/components/parameters/fieldsCode" },
                    { "$ref": "#/components/parameters/fieldsStatus" },
                    { "$ref": "#/components/parameters/fieldsDealer" }
                ],
                "responses": {
                    '200': {
                        "description": "Lista de usuários.",
                        "content": {
                            'application/json': {
                                "schema": {
                                    "type": 'object',
                                    "items": { '$ref': '#/components/schemas/Purchase' }
                                }
                            }
                        }
                    }
                }
            },
            "put": {
                "security": [{ "bearerAuth": [] }],
                "operationId": "PurchaseController_update",
                "parameters": [
                    { "$ref": "#/components/parameters/idParam" }
                ],
                "requestBody": {
                    "required": true,
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/Purchase"
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": ""
                    }
                }
            },
            "delete": {
                "security": [{ "bearerAuth": [] }],
                "operationId": "PurchaseController_remove",
                "parameters": [
                    { "$ref": "#/components/parameters/idParam" }
                ],
                "responses": {
                    "200": {
                        "description": ""
                    }
                }
            }
        },
        "/cashback": {
            "get": {
                "security": [{ "bearerAuth": [] }],
                "operationId": "CashbackController_getCashback",
                "parameters": [

                ],
                "responses": {
                    "200": {
                        "description": ""
                    }
                }
            }
        }
    }
}