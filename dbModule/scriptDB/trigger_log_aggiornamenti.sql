CREATE TABLE pronolegaforum.log_aggiornamenti
(
    tabella character varying(255) COLLATE pg_catalog."default" NOT NULL,
    data_aggiornamento date NOT NULL,
    CONSTRAINT log_aggiornamenti_pkey PRIMARY KEY (tabella)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE pronolegaforum.log_aggiornamenti
    OWNER to postgres;
------------------------------------------------------------------------
CREATE FUNCTION pronolegaforum.update_date_log()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF 
AS $BODY$
DECLARE
	tot_fnd INTEGER;
BEGIN
	SELECT 
		COUNT(*) INTO tot_fnd
	FROM 
		pronolegaforum.log_aggiornamenti 
	WHERE
		tabella = TG_ARGV[0];
	IF tot_fnd = 0 THEN
		INSERT INTO pronolegaforum.log_aggiornamenti
		(tabella, data_aggiornamento) VALUES (TG_ARGV[0], CURRENT_DATE);
	ELSE
		UPDATE pronolegaforum.log_aggiornamenti  
		SET data_aggiornamento = CURRENT_DATE
		WHERE tabella = TG_ARGV[0];
	END IF;
	RETURN NULL;
END;

$BODY$;

ALTER FUNCTION pronolegaforum.update_date_log()
    OWNER TO postgres;
--------------------------------------------------------------------
CREATE TRIGGER upd_data_log_competizioni
    AFTER INSERT OR DELETE OR UPDATE OF id, competizione, nome_pronostico, anni_competizione, punti_esatti, punti_lista, numero_pronostici, logo, tipo_competizione
    ON pronolegaforum.anagrafica_competizioni
    FOR EACH ROW
    EXECUTE PROCEDURE pronolegaforum.update_date_log(anagrafica_competizioni\000);
--------------------------------------------------------------------
CREATE TRIGGER upd_data_log_date_pronostici
    AFTER INSERT OR DELETE OR UPDATE OF stagione, data_apertura, data_chiusura, data_calcolo_classifica
    ON pronolegaforum.date_pronostici
    FOR EACH ROW
    EXECUTE PROCEDURE pronolegaforum.update_date_log(date_pronostici\000);
--------------------------------------------------------------------
CREATE TRIGGER upd_data_log_valori_pronostici
    AFTER INSERT OR DELETE OR UPDATE OF id, stagione, id_competizione, valori_pronostici, valori_pronostici_classifica
    ON pronolegaforum.valori_pronostici
    FOR EACH ROW
    EXECUTE PROCEDURE pronolegaforum.update_date_log(valori_pronostici\000);
--------------------------------------------------------------------