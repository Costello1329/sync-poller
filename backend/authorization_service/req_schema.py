req_schema = {
    "type": "object",
    "properties": {
        "user": {"$ref": "#/definitions/Guid"},
        "poll": {"$ref": "#/definitions/Guid"}
    },
    "required": ["user"],
    "additionalProperties": False,
    "definitions": {
        "Guid": {
            "type": "string",
            "pattern":
                "[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[8-b][0-9a-f]{3}-[0-9a-f]{12}"
        }
    }
}
