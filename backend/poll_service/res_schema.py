res_schema = {
    "type": "object",

    "oneOf": [
        {"$ref": "#/definitions/pollResponseOpen"},
        {"$ref": "#/definitions/pollResponseBefore"},
        {"$ref": "#/definitions/pollResponseAfter"}
    ],

    "definitions": {
        "pollResponseBefore": {
            "type": "object",
            "properties": {
                "status": {"const": "before"},
                "startTime": {
                    "type": "integer",
                    "minimum": 0
                }
            },
            "required": ["status", "startTime"],
            "additionalProperties": False
        },

        "pollResponseOpen": {
            "type": "object",
            "properties": {
                "status": {"const": "open"},
                "question": {"$ref": "#/definitions/pollQuestion"}
            },
            "required": ["status", "question"],
            "additionalProperties": False
        },

        "pollResponseAfter": {
            "type": "object",
            "properties": {
                "status": {"const": "after"}
            },
            "required": ["status"],
            "additionalProperties": False
        },

        "pollProblemBlock": {
            "type": "object",
            "properties": {
                "type": {
                    "oneOf": [
                        {"const": "text"},
                        {"const": "code"}
                    ]
                },
                "text": {"type": "string"}
            },
            "required": ["type", "text"],
            "additionalProperties": False
        },

        "pollQuestion": {
            "type": "object",
            "properties": {
                "startTime": {
                    "type": "integer",
                    "maximum": 0
                },
                "endTime": {
                    "type": "integer",
                    "minimum": 0
                },
                "title": {"type": "string"},
                "guid": {"$ref": "#/definitions/Guid"},
                "problem": {
                    "type": "array",
                    "items": [
                        {"$ref": "#/definitions/pollProblemBlock"}
                    ],
                    "additionalItems": {"$ref": "#/definitions/pollProblemBlock"}
                },
                "solution": {
                    "oneOf": [
                        {
                            "type": "object",
                            "properties": {
                                "type": {
                                    "oneOf": [
                                        {"const": "selectOne"},
                                        {"const": "selectMultiple"}
                                    ]
                                },
                                "labels": {
                                    "type": "array",
                                    "items": [
                                        {"type": "string"}
                                    ],
                                    "additionalItems": {"type": "string"}
                                }
                            },
                            "required": ["type", "labels"],
                            "additionalProperties": False
                        },
                        {
                            "type": "object",
                            "properties": {
                                "type": {"const": "textField"}
                            },
                            "required": ["type"],
                            "additionalProperties": False
                        }
                    ]
                }
            },
            "required": ["startTime", "endTime", "title", "guid", "problem", "solution"],
            "additionalProperties": False
        },

        "Guid": {
            "type": "string",
            "pattern":
                "[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[8-b][0-9a-f]{3}-[0-9a-f]{12}"
        }
    }
}
