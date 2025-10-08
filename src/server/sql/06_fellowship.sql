CREATE TABLE Fellowship (
    id STRING PRIMARY KEY NOT NULL,
    name STRING NOT NULL, 
    otherTags STRING NOT NULL DEFAULT "",
    weaknessTags STRING NOT NULL DEFAULT "",
    improve INTEGER,
    milestone INTEGER,
    abandon INTEGER,
    description STRING NOT NULL DEFAULT "",
    quest STRING NOT NULL DEFAULT "",
    specialImprovements STRING NOT NULL DEFAULT "",
    owner STRING NOT NULL,
    isScratched BOOLEAN NOT NULL
);