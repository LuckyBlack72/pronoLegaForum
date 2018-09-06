-- SCHEMA: pronolegaforum

-- DROP SCHEMA pronolegaforum ;

CREATE SCHEMA pronolegaforum
    AUTHORIZATION postgres;

--------------------------------
CREATE SEQUENCE pronolegaforum.anagrafica_competizioni_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE pronolegaforum.anagrafica_competizioni_id_seq
    OWNER TO postgres;

CREATE SEQUENCE pronolegaforum.anagrafica_partecipanti_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE pronolegaforum.anagrafica_partecipanti_id_seq
    OWNER TO postgres;        

CREATE SEQUENCE pronolegaforum.pronostici_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE pronolegaforum.pronostici_id_seq
    OWNER TO postgres;

----------------------------------------------------
-- Table: pronolegaforum.anagrafica_competizioni

-- DROP TABLE pronolegaforum.anagrafica_competizioni;

CREATE TABLE pronolegaforum.anagrafica_competizioni
(
    id bigint NOT NULL DEFAULT nextval('pronolegaforum.anagrafica_competizioni_id_seq'::regclass),
    competizione character varying(255) COLLATE pg_catalog."default",
    nome_pronostico character varying(255) COLLATE pg_catalog."default",
    anni_competizione integer[],
    CONSTRAINT anagrafica_competizioni_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE pronolegaforum.anagrafica_competizioni
    OWNER to postgres;

-- Table: pronolegaforum.anagrafica_partecipanti

-- DROP TABLE pronolegaforum.anagrafica_partecipanti;

CREATE TABLE pronolegaforum.anagrafica_partecipanti
(
    id bigint NOT NULL DEFAULT nextval('pronolegaforum.anagrafica_partecipanti_id_seq'::regclass),
    nickname character varying(255) COLLATE pg_catalog."default",
    email_address character varying(255) COLLATE pg_catalog."default",
    password_value character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT anagrafica_partecipanti_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE pronolegaforum.anagrafica_partecipanti
    OWNER to postgres;

-- Table: pronolegaforum.pronostici

-- DROP TABLE pronolegaforum.pronostici;

CREATE TABLE pronolegaforum.pronostici
(
    id bigint NOT NULL DEFAULT nextval('pronolegaforum.pronostici_id_seq'::regclass),
    id_partecipanti bigint NOT NULL,
    dati_pronostici json[],
    CONSTRAINT pronostici_pkey PRIMARY KEY (id),
    CONSTRAINT partecipanti_fk FOREIGN KEY (id_partecipanti)
        REFERENCES pronolegaforum.anagrafica_partecipanti (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE pronolegaforum.pronostici
    OWNER to postgres;

-- Index: fki_partecipanti_fk

-- DROP INDEX pronolegaforum.fki_partecipanti_fk;

CREATE INDEX fki_partecipanti_fk
    ON pronolegaforum.pronostici USING btree
    (id_partecipanti)
    TABLESPACE pg_default;

------------------------------------------------------