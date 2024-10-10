--
-- PostgreSQL database dump
--

-- Dumped from database version 12.20 (Debian 12.20-1.pgdg120+1)
-- Dumped by pg_dump version 12.20 (Debian 12.20-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: vector; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA public;


--
-- Name: EXTENSION vector; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION vector IS 'vector data type and ivfflat and hnsw access methods';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: bills; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bills (
    id integer NOT NULL,
    bill_id character varying(255),
    bill_no character varying(255),
    bill_name character varying(255),
    committee character varying(255),
    propose_dt date,
    proc_result character varying(255),
    age integer,
    detail_link text,
    proposer text,
    proposer_list_link text,
    committee_dt date,
    committee_id character varying(255),
    co_proposers text,
    lead_proposer character varying(255),
    content text,
    reason text,
    analysis text
);


ALTER TABLE public.bills OWNER TO postgres;

--
-- Name: bills_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.bills_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.bills_id_seq OWNER TO postgres;

--
-- Name: bills_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.bills_id_seq OWNED BY public.bills.id;


--
-- Name: email_verification_entity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.email_verification_entity (
    id bigint NOT NULL,
    code character varying(255),
    email character varying(255),
    expiry_date timestamp(6) without time zone,
    verified boolean NOT NULL
);


ALTER TABLE public.email_verification_entity OWNER TO postgres;

--
-- Name: email_verification_entity_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.email_verification_entity_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.email_verification_entity_id_seq OWNER TO postgres;

--
-- Name: email_verification_entity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.email_verification_entity_id_seq OWNED BY public.email_verification_entity.id;


--
-- Name: langchain_pg_collection; Type: TABLE; Schema: public; Owner: here_law_admin
--

CREATE TABLE public.langchain_pg_collection (
    uuid uuid NOT NULL,
    name character varying NOT NULL,
    cmetadata json
);


ALTER TABLE public.langchain_pg_collection OWNER TO here_law_admin;

--
-- Name: langchain_pg_embedding; Type: TABLE; Schema: public; Owner: here_law_admin
--

CREATE TABLE public.langchain_pg_embedding (
    id character varying NOT NULL,
    collection_id uuid,
    embedding public.vector,
    document character varying,
    cmetadata jsonb
);


ALTER TABLE public.langchain_pg_embedding OWNER TO here_law_admin;

--
-- Name: law_info; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.law_info (
    law_id character varying(255) NOT NULL,
    proclamation_date date,
    proclamation_number character varying(255),
    language character varying(50),
    law_type character varying(255),
    law_name_kr character varying(255),
    law_name_ch character varying(255),
    law_short_name character varying(255),
    is_title_changed character varying(1),
    is_korean_law character varying(1),
    part_code character varying(50),
    related_department character varying(255),
    phone_number character varying(50),
    enforcement_date date,
    revision_type character varying(50),
    is_annex_included character varying(1),
    is_proclaimed character varying(1),
    contact_department jsonb,
    previous_law_id character varying
);


ALTER TABLE public.law_info OWNER TO postgres;

--
-- Name: law_revision; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.law_revision (
    law_id character varying NOT NULL,
    data json
);


ALTER TABLE public.law_revision OWNER TO postgres;

--
-- Name: law_sections; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.law_sections (
    section_id integer NOT NULL,
    law_id character varying(255),
    part character varying(255),
    chapter character varying(255),
    section character varying(255),
    article character varying(255),
    clause character varying(255),
    content text
);


ALTER TABLE public.law_sections OWNER TO postgres;

--
-- Name: law_sections_section_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.law_sections_section_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.law_sections_section_id_seq OWNER TO postgres;

--
-- Name: law_sections_section_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.law_sections_section_id_seq OWNED BY public.law_sections.section_id;


--
-- Name: lawyer_entity; Type: TABLE; Schema: public; Owner: here_law_admin
--

CREATE TABLE public.lawyer_entity (
    lawyer_id bigint NOT NULL,
    description character varying(255),
    expertise_main character varying(255),
    office_location character varying(255),
    qualification character varying(255),
    user_id bigint,
    phone_number character varying(255),
    point integer
);


ALTER TABLE public.lawyer_entity OWNER TO here_law_admin;

--
-- Name: lawyer_entity_lawyer_id_seq; Type: SEQUENCE; Schema: public; Owner: here_law_admin
--

ALTER TABLE public.lawyer_entity ALTER COLUMN lawyer_id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.lawyer_entity_lawyer_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: lawyer_expertise; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lawyer_expertise (
    lawyer_id bigint NOT NULL,
    expertise character varying(255)
);


ALTER TABLE public.lawyer_expertise OWNER TO postgres;

--
-- Name: legal_cases; Type: TABLE; Schema: public; Owner: here_law_admin
--

CREATE TABLE public.legal_cases (
    case_info_id character varying,
    case_name character varying,
    case_number character varying,
    judgment_date character varying,
    judgment character varying,
    court_name character varying,
    case_type character varying,
    judgment_type character varying,
    issues character varying,
    judgment_summary character varying,
    reference_clause character varying,
    reference_cases character varying,
    full_text text,
    case_number_judgment_date character varying(255)
);


ALTER TABLE public.legal_cases OWNER TO here_law_admin;

--
-- Name: magazines; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.magazines (
    magazine_id integer NOT NULL,
    title character varying(255) NOT NULL,
    category character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    image character varying(255) DEFAULT 'default.jpg'::character varying,
    content text NOT NULL,
    view_count integer DEFAULT 0,
    likes integer DEFAULT 0,
    law_id character varying
);


ALTER TABLE public.magazines OWNER TO postgres;

--
-- Name: magazines_magazine_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.magazines_magazine_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.magazines_magazine_id_seq OWNER TO postgres;

--
-- Name: magazines_magazine_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.magazines_magazine_id_seq OWNED BY public.magazines.magazine_id;


--
-- Name: user_entity; Type: TABLE; Schema: public; Owner: here_law_admin
--

CREATE TABLE public.user_entity (
    id bigint NOT NULL,
    created_date timestamp(6) without time zone,
    email character varying(255),
    email_token character varying(255),
    is_email_verified boolean,
    is_first boolean,
    nickname character varying(255),
    password character varying(255),
    phone_number character varying(255),
    profile_img character varying(255),
    update_date timestamp(6) without time zone,
    user_type character varying(255)
);


ALTER TABLE public.user_entity OWNER TO here_law_admin;

--
-- Name: user_entity_id_seq; Type: SEQUENCE; Schema: public; Owner: here_law_admin
--

ALTER TABLE public.user_entity ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.user_entity_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: user_entity_interests; Type: TABLE; Schema: public; Owner: here_law_admin
--

CREATE TABLE public.user_entity_interests (
    user_entity_id bigint NOT NULL,
    interests character varying(255)
);


ALTER TABLE public.user_entity_interests OWNER TO here_law_admin;

--
-- Name: user_magazine_likes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_magazine_likes (
    id integer NOT NULL,
    user_id integer NOT NULL,
    magazine_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.user_magazine_likes OWNER TO postgres;

--
-- Name: user_magazine_likes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_magazine_likes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_magazine_likes_id_seq OWNER TO postgres;

--
-- Name: user_magazine_likes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_magazine_likes_id_seq OWNED BY public.user_magazine_likes.id;


--
-- Name: user_subscriptions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_subscriptions (
    user_id bigint NOT NULL,
    subscriptions character varying(255)
);


ALTER TABLE public.user_subscriptions OWNER TO postgres;

--
-- Name: verification_token_entity; Type: TABLE; Schema: public; Owner: here_law_admin
--

CREATE TABLE public.verification_token_entity (
    id bigint NOT NULL,
    expiry_date timestamp(6) without time zone,
    token character varying(255),
    user_id bigint NOT NULL
);


ALTER TABLE public.verification_token_entity OWNER TO here_law_admin;

--
-- Name: verification_token_entity_id_seq; Type: SEQUENCE; Schema: public; Owner: here_law_admin
--

ALTER TABLE public.verification_token_entity ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.verification_token_entity_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: bills id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bills ALTER COLUMN id SET DEFAULT nextval('public.bills_id_seq'::regclass);


--
-- Name: email_verification_entity id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.email_verification_entity ALTER COLUMN id SET DEFAULT nextval('public.email_verification_entity_id_seq'::regclass);


--
-- Name: law_sections section_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.law_sections ALTER COLUMN section_id SET DEFAULT nextval('public.law_sections_section_id_seq'::regclass);


--
-- Name: magazines magazine_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.magazines ALTER COLUMN magazine_id SET DEFAULT nextval('public.magazines_magazine_id_seq'::regclass);


--
-- Name: user_magazine_likes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_magazine_likes ALTER COLUMN id SET DEFAULT nextval('public.user_magazine_likes_id_seq'::regclass);


--
-- Name: bills bills_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bills
    ADD CONSTRAINT bills_pkey PRIMARY KEY (id);


--
-- Name: email_verification_entity email_verification_entity_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.email_verification_entity
    ADD CONSTRAINT email_verification_entity_pkey PRIMARY KEY (id);


--
-- Name: langchain_pg_collection langchain_pg_collection_name_key; Type: CONSTRAINT; Schema: public; Owner: here_law_admin
--

ALTER TABLE ONLY public.langchain_pg_collection
    ADD CONSTRAINT langchain_pg_collection_name_key UNIQUE (name);


--
-- Name: langchain_pg_collection langchain_pg_collection_pkey; Type: CONSTRAINT; Schema: public; Owner: here_law_admin
--

ALTER TABLE ONLY public.langchain_pg_collection
    ADD CONSTRAINT langchain_pg_collection_pkey PRIMARY KEY (uuid);


--
-- Name: langchain_pg_embedding langchain_pg_embedding_pkey; Type: CONSTRAINT; Schema: public; Owner: here_law_admin
--

ALTER TABLE ONLY public.langchain_pg_embedding
    ADD CONSTRAINT langchain_pg_embedding_pkey PRIMARY KEY (id);


--
-- Name: law_info law_info_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.law_info
    ADD CONSTRAINT law_info_pkey PRIMARY KEY (law_id);


--
-- Name: law_revision law_revision_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.law_revision
    ADD CONSTRAINT law_revision_pkey PRIMARY KEY (law_id);


--
-- Name: law_sections law_sections_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.law_sections
    ADD CONSTRAINT law_sections_pkey PRIMARY KEY (section_id);


--
-- Name: lawyer_entity lawyer_entity_pkey; Type: CONSTRAINT; Schema: public; Owner: here_law_admin
--

ALTER TABLE ONLY public.lawyer_entity
    ADD CONSTRAINT lawyer_entity_pkey PRIMARY KEY (lawyer_id);


--
-- Name: magazines magazines_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.magazines
    ADD CONSTRAINT magazines_pkey PRIMARY KEY (magazine_id);


--
-- Name: lawyer_entity uk5g7djqkkxckwlcj6e0b5kv5ud; Type: CONSTRAINT; Schema: public; Owner: here_law_admin
--

ALTER TABLE ONLY public.lawyer_entity
    ADD CONSTRAINT uk5g7djqkkxckwlcj6e0b5kv5ud UNIQUE (user_id);


--
-- Name: magazines unique_law_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.magazines
    ADD CONSTRAINT unique_law_id UNIQUE (law_id);


--
-- Name: user_entity user_entity_pkey; Type: CONSTRAINT; Schema: public; Owner: here_law_admin
--

ALTER TABLE ONLY public.user_entity
    ADD CONSTRAINT user_entity_pkey PRIMARY KEY (id);


--
-- Name: user_magazine_likes user_magazine_likes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_magazine_likes
    ADD CONSTRAINT user_magazine_likes_pkey PRIMARY KEY (id);


--
-- Name: verification_token_entity verification_token_entity_pkey; Type: CONSTRAINT; Schema: public; Owner: here_law_admin
--

ALTER TABLE ONLY public.verification_token_entity
    ADD CONSTRAINT verification_token_entity_pkey PRIMARY KEY (id);


--
-- Name: ix_cmetadata_gin; Type: INDEX; Schema: public; Owner: here_law_admin
--

CREATE INDEX ix_cmetadata_gin ON public.langchain_pg_embedding USING gin (cmetadata jsonb_path_ops);


--
-- Name: ix_langchain_pg_embedding_id; Type: INDEX; Schema: public; Owner: here_law_admin
--

CREATE UNIQUE INDEX ix_langchain_pg_embedding_id ON public.langchain_pg_embedding USING btree (id);


--
-- Name: verification_token_entity fk1llgpobomks3q7t6qwqtd17ef; Type: FK CONSTRAINT; Schema: public; Owner: here_law_admin
--

ALTER TABLE ONLY public.verification_token_entity
    ADD CONSTRAINT fk1llgpobomks3q7t6qwqtd17ef FOREIGN KEY (user_id) REFERENCES public.user_entity(id);


--
-- Name: magazines fk_law_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.magazines
    ADD CONSTRAINT fk_law_id FOREIGN KEY (law_id) REFERENCES public.law_info(law_id);


--
-- Name: user_magazine_likes fk_magazine; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_magazine_likes
    ADD CONSTRAINT fk_magazine FOREIGN KEY (magazine_id) REFERENCES public.magazines(magazine_id) ON DELETE CASCADE;


--
-- Name: law_info fk_previous_law_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.law_info
    ADD CONSTRAINT fk_previous_law_id FOREIGN KEY (previous_law_id) REFERENCES public.law_info(law_id);


--
-- Name: user_magazine_likes fk_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_magazine_likes
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.user_entity(id) ON DELETE CASCADE;


--
-- Name: user_subscriptions fkjvvc0uxv5svod2n9ovcnmsi44; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_subscriptions
    ADD CONSTRAINT fkjvvc0uxv5svod2n9ovcnmsi44 FOREIGN KEY (user_id) REFERENCES public.user_entity(id);


--
-- Name: user_entity_interests fkki0fg4fix963sxaci9frl4w4w; Type: FK CONSTRAINT; Schema: public; Owner: here_law_admin
--

ALTER TABLE ONLY public.user_entity_interests
    ADD CONSTRAINT fkki0fg4fix963sxaci9frl4w4w FOREIGN KEY (user_entity_id) REFERENCES public.user_entity(id);


--
-- Name: lawyer_expertise fknltfsk2h5hv6ug42ju3v4tdd4; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lawyer_expertise
    ADD CONSTRAINT fknltfsk2h5hv6ug42ju3v4tdd4 FOREIGN KEY (lawyer_id) REFERENCES public.lawyer_entity(lawyer_id);


--
-- Name: lawyer_entity fkqrda6olgg11gtvjhnle7ejddw; Type: FK CONSTRAINT; Schema: public; Owner: here_law_admin
--

ALTER TABLE ONLY public.lawyer_entity
    ADD CONSTRAINT fkqrda6olgg11gtvjhnle7ejddw FOREIGN KEY (user_id) REFERENCES public.user_entity(id);


--
-- Name: langchain_pg_embedding langchain_pg_embedding_collection_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: here_law_admin
--

ALTER TABLE ONLY public.langchain_pg_embedding
    ADD CONSTRAINT langchain_pg_embedding_collection_id_fkey FOREIGN KEY (collection_id) REFERENCES public.langchain_pg_collection(uuid) ON DELETE CASCADE;


--
-- Name: law_revision law_revision_law_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.law_revision
    ADD CONSTRAINT law_revision_law_id_fkey FOREIGN KEY (law_id) REFERENCES public.law_info(law_id);


--
-- PostgreSQL database dump complete
--

