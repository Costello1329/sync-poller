req_schema = {
    "type": "object",
    "properties": {
        "session": {"$ref": "#/definitions/Guid"},
        "poll": {"$ref": "#/definitions/Guid"},
        "answer": {
            "type": "object",
            "properties": {
                "guid": {"$ref": "#/definitions/Guid"},
                "data": {"$ref": "#/definitions/PollSolution"}
            },
            "required": ["guid", "data"],
            "additionalProperties": False
        }
    },
    "required": ["session", "poll", "answer"],
    "additionalProperties": False,
    "definitions": {
        "Guid": {
            "type": "string",
            "pattern":
                "[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[8-b][0-9a-f]{3}-[0-9a-f]{12}"
        },

        "PollSolution": {
            "oneOf": [
                {
                    "type": "object",
                    "properties": {
                        "type": {
                            "type": "string",
                            "const": "checkbox"
                        },
                        "data": {
                            "type": "array",
                            "items": [{"type": "boolean"}],
                            "additionalItems": {"type": "boolean"}
                        }
                    },
                    "required": ["type", "data"],
                    "additionalProperties": False
                },
                {
                    "type": "object",
                    "properties": {
                        "type": {
                            "type": "string",
                            "const": "radio"
                        },
                        "data": {
                            "oneOf": [
                                {
                                    "type": "integer",
                                    "minimum": 0
                                },
                                {"const": None}
                            ]
                        }
                    },
                    "required": ["type", "data"],
                    "additionalProperties": False
                },
                {
                    "type": "object",
                    "properties": {
                        "type": {
                            "type": "string",
                            "const": "textField"
                        },
                        "data": {"type": "string"}
                    },
                    "required": ["type", "data"],
                    "additionalProperties": False
                }
            ]
        }
    }
}
