res_schema = {
    "anyOf": [
        {"$ref": "#/definitions/haveGotUser"},
        {"$ref": "#/definitions/haveNotGotUser"}
    ],

    "definitions": {
        "haveGotUser": {
            "type": "object",
            "properties": {
                "gotUser": {"const": True},
                "role": {"enum": ["student"]},
                "userGuid": {"$ref": "#/definitions/Guid"}
            },
            "required": ["gotUser", "role", "userGuid"],
            "additionalProperties": False
        },

        "haveNotGotUser": {
            "type": "object",
            "properties": {
                "gotUser": {"const": False}
            },
            "required": ["gotUser"],
            "additionalProperties": False
        },

        "Guid": {
            "type": "string",
            "pattern":
                "[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[8-b][0-9a-f]{3}-[0-9a-f]{12}"
        }
    }
}
