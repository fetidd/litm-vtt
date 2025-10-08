CREATE TABLE Hero (
    id STRING PRIMARY KEY NOT NULL, 
    name STRING NOT NULL, 
    promise NUMBER NOT NULL, 
    description STRING NOT NULL DEFAULT '', 
    themes STRING NOT NULL DEFAULT '', 
    backpack STRING NOT NULL DEFAULT '', 
    relationships STRING NOT NULL DEFAULT '', 
    fellowship STRING, owner STRING NOT NULL
);
