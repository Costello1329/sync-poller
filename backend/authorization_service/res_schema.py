res_schema = {
    "anyOf": [
        {"$ref": "#/definitions/haveAuthorized"},
        {"$ref": "#/definitions/haveNotAuthorized"}
    ],

    "definitions": {
        "haveAuthorized": {
            "type": "object",
            "properties": {
                "authorized": {"const": True},
                "session": {"$ref": "#/definitions/Guid"}
            },
            "required": ["authorized", "session"],
            "additionalProperties": False
        },

        "haveNotAuthorized": {
            "type": "object",
            "properties": {
                "authorized": {"const": False}
            },
            "required": ["authorized"],
            "additionalProperties": False
        },

        "Guid": {
            "type": "string",
            "pattern":
                "[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[8-b][0-9a-f]{3}-[0-9a-f]{12}"
        }
    }
}
