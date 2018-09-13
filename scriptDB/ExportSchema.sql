--
-- PostgreSQL database dump
--

-- Dumped from database version 10.4
-- Dumped by pg_dump version 10.4

-- Started on 2018-09-13 16:11:49

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 10 (class 2615 OID 24579)
-- Name: pronolegaforum; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA pronolegaforum;


ALTER SCHEMA pronolegaforum OWNER TO postgres;

--
-- TOC entry 202 (class 1259 OID 24580)
-- Name: anagrafica_competizioni_id_seq; Type: SEQUENCE; Schema: pronolegaforum; Owner: postgres
--

CREATE SEQUENCE pronolegaforum.anagrafica_competizioni_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE pronolegaforum.anagrafica_competizioni_id_seq OWNER TO postgres;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 203 (class 1259 OID 24582)
-- Name: anagrafica_competizioni; Type: TABLE; Schema: pronolegaforum; Owner: postgres
--

CREATE TABLE pronolegaforum.anagrafica_competizioni (
    id bigint DEFAULT nextval('pronolegaforum.anagrafica_competizioni_id_seq'::regclass) NOT NULL,
    competizione character varying(255),
    nome_pronostico character varying(255),
    anni_competizione integer[],
    punti_esatti integer,
    punti_lista integer,
    numero_pronostici integer
);


ALTER TABLE pronolegaforum.anagrafica_competizioni OWNER TO postgres;

--
-- TOC entry 204 (class 1259 OID 24591)
-- Name: anagrafica_partecipanti_id_seq; Type: SEQUENCE; Schema: pronolegaforum; Owner: postgres
--

CREATE SEQUENCE pronolegaforum.anagrafica_partecipanti_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE pronolegaforum.anagrafica_partecipanti_id_seq OWNER TO postgres;

--
-- TOC entry 205 (class 1259 OID 24593)
-- Name: anagrafica_partecipanti; Type: TABLE; Schema: pronolegaforum; Owner: postgres
--

CREATE TABLE pronolegaforum.anagrafica_partecipanti (
    id bigint DEFAULT nextval('pronolegaforum.anagrafica_partecipanti_id_seq'::regclass) NOT NULL,
    nickname character varying(255),
    email_address character varying(255),
    password_value character varying(255)
);


ALTER TABLE pronolegaforum.anagrafica_partecipanti OWNER TO postgres;

--
-- TOC entry 206 (class 1259 OID 24602)
-- Name: pronostici_id_seq; Type: SEQUENCE; Schema: pronolegaforum; Owner: postgres
--

CREATE SEQUENCE pronolegaforum.pronostici_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE pronolegaforum.pronostici_id_seq OWNER TO postgres;

--
-- TOC entry 207 (class 1259 OID 32771)
-- Name: pronostici; Type: TABLE; Schema: pronolegaforum; Owner: postgres
--

CREATE TABLE pronolegaforum.pronostici (
    id bigint DEFAULT nextval('pronolegaforum.pronostici_id_seq'::regclass) NOT NULL,
    id_partecipanti bigint NOT NULL,
    stagione integer NOT NULL,
    id_competizione bigint NOT NULL,
    pronostici character varying(255)[]
);


ALTER TABLE pronolegaforum.pronostici OWNER TO postgres;

--
-- TOC entry 208 (class 1259 OID 32790)
-- Name: valori_pronostici_id_seq; Type: SEQUENCE; Schema: pronolegaforum; Owner: postgres
--

CREATE SEQUENCE pronolegaforum.valori_pronostici_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE pronolegaforum.valori_pronostici_id_seq OWNER TO postgres;

--
-- TOC entry 209 (class 1259 OID 32792)
-- Name: valori_pronostici; Type: TABLE; Schema: pronolegaforum; Owner: postgres
--

CREATE TABLE pronolegaforum.valori_pronostici (
    id bigint DEFAULT nextval('pronolegaforum.valori_pronostici_id_seq'::regclass) NOT NULL,
    stagione integer NOT NULL,
    id_competizione bigint NOT NULL,
    valori_pronostici character varying(255)[]
);


ALTER TABLE pronolegaforum.valori_pronostici OWNER TO postgres;

--
-- TOC entry 2843 (class 0 OID 24582)
-- Dependencies: 203
-- Data for Name: anagrafica_competizioni; Type: TABLE DATA; Schema: pronolegaforum; Owner: postgres
--

COPY pronolegaforum.anagrafica_competizioni (id, competizione, nome_pronostico, anni_competizione, punti_esatti, punti_lista, numero_pronostici) FROM stdin;
1	Serie A	Serie A	{2018}	3	0	20
2	Capo Cannoniere Serie A\n	Capo Cannoniere Serie A	{2018}	5	2	5
3	Premier League	Premier League	{2018}	5	2	5
4	Champions League	Champions League	{2018}	5	2	4
5	Serie B	Serie B	{2018}	5	2	3
\.


--
-- TOC entry 2845 (class 0 OID 24593)
-- Dependencies: 205
-- Data for Name: anagrafica_partecipanti; Type: TABLE DATA; Schema: pronolegaforum; Owner: postgres
--

COPY pronolegaforum.anagrafica_partecipanti (id, nickname, email_address, password_value) FROM stdin;
1	Lucky Black	fantasportLB@gmail.com	erika2013
\.


--
-- TOC entry 2847 (class 0 OID 32771)
-- Dependencies: 207
-- Data for Name: pronostici; Type: TABLE DATA; Schema: pronolegaforum; Owner: postgres
--

COPY pronolegaforum.pronostici (id, id_partecipanti, stagione, id_competizione, pronostici) FROM stdin;
4	1	2018	1	{Roma,Juventus}
\.


--
-- TOC entry 2849 (class 0 OID 32792)
-- Dependencies: 209
-- Data for Name: valori_pronostici; Type: TABLE DATA; Schema: pronolegaforum; Owner: postgres
--

COPY pronolegaforum.valori_pronostici (id, stagione, id_competizione, valori_pronostici) FROM stdin;
2	2018	1	{Atalanta,Bologna,Cagliari,Chievo,Empoli,Fiorentina,Frosinone,Genoa,Inter,Juventus,Lazio,Milan,Napoli,Parma,Roma,Sampdoria,Sassuolo,Spal,Torino,Udinese}
3	2018	3	{Arsenal,Bournemouth,Brighton,Burnley,Cardiff,Chelsea,"Crystal Palace",Everton,Fulham,Huddersfield,Leicester,Liverpool,"Manchester City","Manchester Utd",Newcastle,Southampton,Tottenham,Watford,"West Ham",Wolves}
4	2018	5	{Ascoli,Benevento,Brescia,Carpi,Cittadella,Cosenza,Cremonese,Crotone,Foggia,Lecce,Livorno,Padova,Palermo,Perugia,Pescara,Salernitana,Spezia,Venezia,Verona}
5	2018	4	{"AEK Athens (GRE)","Ajax (NED)","Atlético Madrid (ESP)","Barcellona (ESP)","BATE Borisov (BLR)","Bayern München (GER)","Benfica (POR)","Borussia Dortmund (GER)","Club Brugge (BEL)","Crvena zvezda (SRB)","CSKA Moskva (RUS)","Dinamo Zagreb (CRO)","Dynamo Kyiv (UKR)","Galatasaray (TUR)","Hoffenheim (GER)","Inter (ITA)","Juventus (ITA)","Liverpool (ENG)","Lokomotiv Moskva (RUS)","Lyon (FRA)","Manchester City (ENG)","Manchester United (ENG)","Monaco (FRA)","Napoli (ITA)","PAOK (GRE)","Porto (POR)","PSG (FRA)","Real Madrid (ESP)","Roma (ITA)","Salzburg (AUT)","Schalke (GER)","Shakhtar Donetsk (UKR)","Tottenham Hotspur (ENG) ","Valencia (ESP)","Vidi (HUN)","Viktoria Plzeň (CZE)"}
6	2018	2	{"ACQUAH Afriyie","ADJAPONG Claud","ALLAN Marques Loureiro","ANDERSON Djavan","ANTENUCCI Mirco","ARAMU Mattia","AVENATTI Felipe Nicolas","BABACAR Khouma El Hadji","BACCA Carlos Arturo","BADELJ Milan","BADU Emmanuel Agyemang","BALDASSIN Luca","BALIC Andrija","BARAK Antonin","BARAYE Bertrand Yves","BARELLA Nicolo'","BARILLA' Antonino","BARRETO Edgar Osvaldo","BARROW Musa","BASELLI Daniele","BEGHETTO Andrea","BEHRAMI Valon","BELOTTI Andrea","BENASSI Marco","BENNACER Ismael","BENTANCUR Rodrigo","BERARDI Domenico","BERENGUER Alejandro","BERISHA Valon","BERNARDESCHI Federico","BERTOLACCI Andrea","BESEA Prince Emmanuel","BESSA Daniel","BIABIANY Jonathan Ludovic","BIFULCO Alfredo","BIGLIA Lucas Rodrigo","BIRSA Valter","BOATENG Kevin-Prince","BOGA Jeremie","BONAVENTURA Giacomo","BORINI Fabio","BORJA VALERO Iglesias","BOURABIA Mehdi","BRADARIC Filip","BRIGHI Matteo","BRIGNOLA Enrico","BROZOVIC Marcelo","BUCHEL Marcel","BUTIC Karlo","CAICEDO Felipe Salvador","CALAIO' Emanuele","CALHANOGLU Hakan","CALIGARA Fabrizio","CALLEGARI Lorenzo","CALLEJON Jose' Maria","CAN Emre","CANDELA Antonio","CANDREVA Antonio","CAPEZZI Leonardo","CAPONE Christian","CAPRARI Gianluca","CAPUTO Francesco","CARRIERO Giuseppe","CASSATA Francesco","CASTRO Lucas Nahuel","CATALDI Danilo","CERAVOLO Giovanni Fabio","CERRI Alberto","CHIBSAH Yussif Raman","CHIESA Federico","CIANO Camillo","CICIRETTI Amato","CIGARINI Luca","CINELLI Antonio","CIOFANI Daniel","CITRO Nicola","CLEMENZA Luca","COLOMBATTO Santiago","CONTI Andrea","CORIC Ante","CORNELIUS Andreas","CORREA Carlos Joaquin","COSTA Filippo","COULIBALY Mamadou","CRISETIG Lorenzo","CRISTANTE Bryan","CRISTOFORO Sebastian Carlos","CUADRADO Juan Guillermo","CUTRONE Patrick","D'ALESSANDRO Marco","DA CRUZ Alessio","DABO Bryan","DALMONTE Nicola","DAMASCAN Vitalie","DE PAUL Rodrigo Javier","DE ROON Marten","DE ROSSI Daniele","DEFREL Gregoire","DEIOLA Alessandro","DEPAOLI Fabio","DESSENA Daniele","DESTRO Mattia","DEZI Jacopo","DI FRANCESCO Federico","DI GAUDIO Antonio","DI GENNARO Davide","DIAWARA Amadou","DIONISI Federico","DJORDJEVIC Filip","DJURICIC Filip","DONSAH Godfred","DOUGLAS COSTA de Souza","DUNCAN Joseph Alfred","DYBALA Paulo Bruno","DZEKO Edin","DZEMAILI Blerim","EDERA Simone","EL SHAARAWY Stephan","EMMERS Xian","ESPOSITO Salvatore","EVERTON LUIZ Guimaraes Bilher","EYSSERIC Valentin","FALCINELLI Diego","FANTACCI Tommaso","FARAGO' Paolo Pancrazio","FARES Mohamed Salim","FARIAS Diego da Silva","FAVILLI Andrea","FERNANDES Edmilson","FLOCCARI Sergio","FLORO FLORES Antonio","FOFANA Seko Mohamed","FRATTESI Davide","FREULER Remo","GABBIA Matteo","GAGLIARDINI Roberto","GALABINOV Andrey Asenov","GALANO Cristian","GARRITANO Luca","GAUDINO Gianluca","GERSON Santos da Silva","GIACCHERINI Emanuele","GNOUKOURI Assane Demoya","GOMEZ Alejandro Dario","GONALONS Maxime","GORI Mirko","GOSENS Robin","GRAICIAR Martin","GRASSI Alberto","HALILOVIC Alen","HALLFREDSSON Emil","HAMSIK Marek","HAN Kwang-Song","HETEMAJ Perparim","HIGUAIN Gonzalo Gerardo","HILJEMARK Oscar Karl","IAGO FALQUE Silva","ICARDI Mauro Emanuel","ILICIC Josip","IMMOBILE Ciro","INGELSSON Svante Ulf","INGLESE Roberto","INIGUEZ Gaspar Emanuel","INSIGNE Lorenzo","IONITA Artur","IVAN David","JAKUPOVIC Arnel","JALLOW Lamin","JANKTO Jakub","JOAO MARIO Naval da Costa","JOAO PEDRO Geraldino","JORDAO Bruno Andre' Cavaco","KARAMOH Yann","KATUMA Aron","KEAN Moise Bioty","KEITA Balde Diao","KESSIE' Franck Yannick","KHEDIRA Sami","KISHNA Ricardo","KIYINE Sofian","KLUIVERT Justin","KONE Panagiotis Georgios","KOUAME' Christian Michael","KOWNACKI Dawid","KREJCI Ladislav","KRUNIC Rade","KURTIC Jasmin","LA GUMINA Antonino","LAPADULA Gianluca","LASAGNA Kevin","LAXALT Diego Sebastian","LAZOVIC Darko","LAZZARI Manuel","LEIVA Lucas Pezzini","LERIS Mehdi","LINETTY Karol","LJAJIC Adem","LOCATELLI Manuel","LOLLO Lorenzo","LOMBARDI Cristiano","LUIS ALBERTO Romero Alconchel","LUKIC Sasa","LULIC Senad","MACHIS Darwin Daniel","MAGNANELLI Francesco","MAIELLO Raffaele","MALLE' Aly","MANDRAGORA Rolando","MANDZUKIC Mario","MARCHISIO Claudio","MARILUNGO Guido","MARTINEZ Lautaro Javier","MARUSIC Adam","MATARESE Luca","MATRI Alessandro","MATUIDI Blaise","MAURI Jose' Agustin","MAZZITELLI Luca","MCHEDLIDZE Levan","MEDEIROS Iuri Jose' Picanco","MEGGIORINI Riccardo","MEITE' Soualiho","MERTENS Dries","MICHAEL Kingsley Dogo","MICIN Petar","MILIK Arkadiusz","MILINKOVIC-SAVIC Sergej","MINALA Joseph Marie","MIRALLAS Kevin Antonio","MISSIROLI Simone","MONCINI Gabriele","MONTOLIVO Riccardo","MORRISON Ravel Ryan","MRAZ Samuel","MUNARI Gianni","MURANO Jacopo","MURGIA Alessandro","NAGY Adam","NAINGGOLAN Radja","NETO Pedro Lomba","NIANG M'baye","NIKOLIC Lazar","NINKOVIC Nikola","NORGAARD Christian Thers","OBI Joel Chukwuma","ODGAARD Jens","OIKONOMIDIS Christopher James","OKWONKWO Orji","OMEONGA Stephane","ORSOLINI Riccardo","OUNAS Adam","PADOIN Simone","PAGANINI Luca","PAJAC Marko","PALACIO Rodrigo Sebastian","PALOSCHI Alberto","PANDEV Goran","PARIGINI Vittorio","PAROLO Marco","PASALIC Mario","PASTORE Javier Matias","PAVOLETTI Leonardo","PEETERS Daouda","PELLEGRINI Lorenzo","PELLISSIER Sergio","PEREA Brayan Andres","PERICA Stipe","PERISIC Ivan","PEROTTI Diego","PESSINA Matteo","PETAGNA Andrea","PIATEK Krzysztof","PINAMONTI Andrea","PJACA Marko","PJANIC Miralem","POLI Andrea","POLITANO Matteo","PONTISSO Simone","PRAET Dennis","PUCCIARELLI Manuel","PULGAR Erick Antonio","PUSSETTO Ignacio","QUAGLIARELLA Fabio","RADOVANOVIC Ivan","RAMIREZ Gaston Exequiel","RASPADORI Giacomo","RECA Arkadiusz","RIGONI Luca","RIGONI Nicola","RINCON Tomas Eduardo","RIZZO Luca","RODRIGUEZ Alejandro","ROG Marko","ROLANDO Gabriele","ROLON Esteban Leonardo","ROMULO Souza Orestes","RONALDO Cristiano","ROSSI Alessandro","RUIZ Fabian","SAMMARCO Paolo","SANDRO Raniere Guimaraes Cordeiro","SANTANDER Federico Javier","SAPONARA Riccardo","SAU Marco","SCAGLIA Luigi","SCAMACCA Gianluca","SCAVONE Manuel","SCHIATTARELLA Pasquale","SCHICK Patrik","SCOZZARELLA Matteo","SENSI Stefano","SILIGARDI Luca","SIMEONE Giovanni Pablo","SODDIMO Danilo","SOTTIL Riccardo","SOWE Ali","SPINAZZOLA Leonardo","SPROCATI Mattia","STEPINSKI Mariusz","STIJEPOVIC Ognjen","STROOTMAN Kevin Johannes","STULAC Leo","SUSO Jesus Fernandez","SVANBERG Mattias","THEREAU Cyril","TRAORE' Hamed Junior","TROTTA Marcello","TUMMINELLO Marco","UNDER Cengiz","VACCA Antonio Junior","VALDIFIORI Mirko","VALENCIA Juan Manuel","VALOTI Mattia","VALZANIA Luca","VECINO Matias","VERDI Simone","VERETOUT Jordan Marcel","VERRE Valerio","VIEIRA Ronaldo","VIGNATO Emanuel","VINICIUS Carlos Alves","VITALE Mattia","VIVIANI Federico","VIZEU Felipe dos Reis","VLAHOVIC Dusan","VUTOV Antonio","YOUNES Amin","ZAJC Miha","ZANIMACCHIA Luca","ZANIOLO Nicolo'","ZAPATA Duvan Esteban","ZEKHNINI Rafik","ZIELINSKI Piotr Sebastian"}
\.


--
-- TOC entry 2855 (class 0 OID 0)
-- Dependencies: 202
-- Name: anagrafica_competizioni_id_seq; Type: SEQUENCE SET; Schema: pronolegaforum; Owner: postgres
--

SELECT pg_catalog.setval('pronolegaforum.anagrafica_competizioni_id_seq', 5, true);


--
-- TOC entry 2856 (class 0 OID 0)
-- Dependencies: 204
-- Name: anagrafica_partecipanti_id_seq; Type: SEQUENCE SET; Schema: pronolegaforum; Owner: postgres
--

SELECT pg_catalog.setval('pronolegaforum.anagrafica_partecipanti_id_seq', 1, true);


--
-- TOC entry 2857 (class 0 OID 0)
-- Dependencies: 206
-- Name: pronostici_id_seq; Type: SEQUENCE SET; Schema: pronolegaforum; Owner: postgres
--

SELECT pg_catalog.setval('pronolegaforum.pronostici_id_seq', 4, true);


--
-- TOC entry 2858 (class 0 OID 0)
-- Dependencies: 208
-- Name: valori_pronostici_id_seq; Type: SEQUENCE SET; Schema: pronolegaforum; Owner: postgres
--

SELECT pg_catalog.setval('pronolegaforum.valori_pronostici_id_seq', 6, true);


--
-- TOC entry 2709 (class 2606 OID 24590)
-- Name: anagrafica_competizioni anagrafica_competizioni_pkey; Type: CONSTRAINT; Schema: pronolegaforum; Owner: postgres
--

ALTER TABLE ONLY pronolegaforum.anagrafica_competizioni
    ADD CONSTRAINT anagrafica_competizioni_pkey PRIMARY KEY (id);


--
-- TOC entry 2711 (class 2606 OID 24601)
-- Name: anagrafica_partecipanti anagrafica_partecipanti_pkey; Type: CONSTRAINT; Schema: pronolegaforum; Owner: postgres
--

ALTER TABLE ONLY pronolegaforum.anagrafica_partecipanti
    ADD CONSTRAINT anagrafica_partecipanti_pkey PRIMARY KEY (id);


--
-- TOC entry 2715 (class 2606 OID 32779)
-- Name: pronostici pronostici_pkey; Type: CONSTRAINT; Schema: pronolegaforum; Owner: postgres
--

ALTER TABLE ONLY pronolegaforum.pronostici
    ADD CONSTRAINT pronostici_pkey PRIMARY KEY (id);


--
-- TOC entry 2713 (class 2606 OID 32807)
-- Name: anagrafica_partecipanti unique_index_nickname; Type: CONSTRAINT; Schema: pronolegaforum; Owner: postgres
--

ALTER TABLE ONLY pronolegaforum.anagrafica_partecipanti
    ADD CONSTRAINT unique_index_nickname UNIQUE (nickname);


--
-- TOC entry 2717 (class 2606 OID 32800)
-- Name: valori_pronostici valori_pronostici_pkey; Type: CONSTRAINT; Schema: pronolegaforum; Owner: postgres
--

ALTER TABLE ONLY pronolegaforum.valori_pronostici
    ADD CONSTRAINT valori_pronostici_pkey PRIMARY KEY (id);


--
-- TOC entry 2718 (class 2606 OID 32785)
-- Name: pronostici competizioni_fk; Type: FK CONSTRAINT; Schema: pronolegaforum; Owner: postgres
--

ALTER TABLE ONLY pronolegaforum.pronostici
    ADD CONSTRAINT competizioni_fk FOREIGN KEY (id_competizione) REFERENCES pronolegaforum.anagrafica_competizioni(id);


--
-- TOC entry 2720 (class 2606 OID 32801)
-- Name: valori_pronostici competizioni_fk; Type: FK CONSTRAINT; Schema: pronolegaforum; Owner: postgres
--

ALTER TABLE ONLY pronolegaforum.valori_pronostici
    ADD CONSTRAINT competizioni_fk FOREIGN KEY (id_competizione) REFERENCES pronolegaforum.anagrafica_competizioni(id);


--
-- TOC entry 2719 (class 2606 OID 32780)
-- Name: pronostici partecipanti_fk; Type: FK CONSTRAINT; Schema: pronolegaforum; Owner: postgres
--

ALTER TABLE ONLY pronolegaforum.pronostici
    ADD CONSTRAINT partecipanti_fk FOREIGN KEY (id_partecipanti) REFERENCES pronolegaforum.anagrafica_partecipanti(id);


-- Completed on 2018-09-13 16:11:51

--
-- PostgreSQL database dump complete
--

