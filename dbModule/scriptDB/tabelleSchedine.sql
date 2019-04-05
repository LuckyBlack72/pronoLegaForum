-- Table: pronolegaforum.anagrafica_competizioni_settimanali

-- DROP TABLE pronolegaforum.anagrafica_competizioni_settimanali;

CREATE TABLE pronolegaforum.anagrafica_competizioni_settimanali
(
    stagione integer,
    settimana integer,
    pronostici character varying(255)[] COLLATE pg_catalog."default",
    valori_pronostici_classifica character varying(255)[] COLLATE pg_catalog."default",
    date_competizione pronolegaforum.date_competizione[],
    numero_pronostici integer,
    punti_esatti integer,
    punti_lista integer,
    id bigint NOT NULL DEFAULT nextval('pronolegaforum.anagrafica_competizioni_settimanali_id_seq'::regclass),
    CONSTRAINT anagrafica_competizioni_settimanali_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE pronolegaforum.anagrafica_competizioni_settimanali
    OWNER to postgres;

/* ------------------------------------------------------------------------ */

-- Table: pronolegaforum.pronostici_settimanali

-- DROP TABLE pronolegaforum.pronostici_settimanali;

CREATE TABLE pronolegaforum.pronostici_settimanali
(
    id bigint NOT NULL DEFAULT nextval('pronolegaforum.pronostici_settimanali_id_seq'::regclass),
    id_partecipanti bigint NOT NULL,
    stagione integer NOT NULL,
    settimana integer NOT NULL,
    pronostici character varying(255)[] COLLATE pg_catalog."default",
    CONSTRAINT pronostici_settimanali_pkey PRIMARY KEY (id),
    CONSTRAINT partecipanti_fk FOREIGN KEY (id_partecipanti)
        REFERENCES pronolegaforum.anagrafica_partecipanti (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE pronolegaforum.pronostici_settimanali
    OWNER to postgres;

/* ---------------------------------------------------------------------- */

-- SEQUENCE: pronolegaforum.anagrafica_competizioni_settimanali_id_seq

-- DROP SEQUENCE pronolegaforum.anagrafica_competizioni_settimanali_id_seq;

CREATE SEQUENCE pronolegaforum.anagrafica_competizioni_settimanali_id_seq;

ALTER SEQUENCE pronolegaforum.anagrafica_competizioni_settimanali_id_seq
    OWNER TO postgres;

/* ---------------------------------------------------------------------- */

-- SEQUENCE: pronolegaforum.pronostici_settimanali_id_seq

-- DROP SEQUENCE pronolegaforum.pronostici_settimanali_id_seq;

CREATE SEQUENCE pronolegaforum.pronostici_settimanali_id_seq;

ALTER SEQUENCE pronolegaforum.pronostici_settimanali_id_seq
    OWNER TO postgres;