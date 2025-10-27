--
-- PostgreSQL database dump
--

\restrict gPm2uhbqpzHSefEsIjJqQAzckgDN6MJiWooM9XlkK3AfGYLIMxVVXbABadJbcHD

-- Dumped from database version 15.14 (Debian 15.14-1.pgdg13+1)
-- Dumped by pg_dump version 15.14 (Debian 15.14-1.pgdg13+1)

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
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: skillwise_user
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO skillwise_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: achievements; Type: TABLE; Schema: public; Owner: skillwise_user
--

CREATE TABLE public.achievements (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text NOT NULL,
    category character varying(100) NOT NULL,
    badge_icon character varying(255),
    points_reward integer DEFAULT 0,
    criteria jsonb NOT NULL,
    is_active boolean DEFAULT true,
    rarity character varying(20) DEFAULT 'common'::character varying,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.achievements OWNER TO skillwise_user;

--
-- Name: achievements_id_seq; Type: SEQUENCE; Schema: public; Owner: skillwise_user
--

CREATE SEQUENCE public.achievements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.achievements_id_seq OWNER TO skillwise_user;

--
-- Name: achievements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: skillwise_user
--

ALTER SEQUENCE public.achievements_id_seq OWNED BY public.achievements.id;


--
-- Name: ai_feedback; Type: TABLE; Schema: public; Owner: skillwise_user
--

CREATE TABLE public.ai_feedback (
    id integer NOT NULL,
    submission_id integer NOT NULL,
    feedback_text text NOT NULL,
    feedback_type character varying(50) DEFAULT 'general'::character varying,
    confidence_score numeric(3,2),
    suggestions text[],
    strengths text[],
    improvements text[],
    ai_model character varying(50),
    processing_time_ms integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT ai_feedback_confidence_score_check CHECK (((confidence_score >= (0)::numeric) AND (confidence_score <= (1)::numeric)))
);


ALTER TABLE public.ai_feedback OWNER TO skillwise_user;

--
-- Name: ai_feedback_id_seq; Type: SEQUENCE; Schema: public; Owner: skillwise_user
--

CREATE SEQUENCE public.ai_feedback_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ai_feedback_id_seq OWNER TO skillwise_user;

--
-- Name: ai_feedback_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: skillwise_user
--

ALTER SEQUENCE public.ai_feedback_id_seq OWNED BY public.ai_feedback.id;


--
-- Name: challenges; Type: TABLE; Schema: public; Owner: skillwise_user
--

CREATE TABLE public.challenges (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text NOT NULL,
    instructions text NOT NULL,
    category character varying(100) NOT NULL,
    difficulty_level character varying(20) DEFAULT 'medium'::character varying,
    estimated_time_minutes integer,
    points_reward integer DEFAULT 10,
    max_attempts integer DEFAULT 3,
    requires_peer_review boolean DEFAULT false,
    is_active boolean DEFAULT true,
    created_by integer,
    tags text[],
    prerequisites text[],
    learning_objectives text[],
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.challenges OWNER TO skillwise_user;

--
-- Name: challenges_id_seq; Type: SEQUENCE; Schema: public; Owner: skillwise_user
--

CREATE SEQUENCE public.challenges_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.challenges_id_seq OWNER TO skillwise_user;

--
-- Name: challenges_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: skillwise_user
--

ALTER SEQUENCE public.challenges_id_seq OWNED BY public.challenges.id;


--
-- Name: goals; Type: TABLE; Schema: public; Owner: skillwise_user
--

CREATE TABLE public.goals (
    id integer NOT NULL,
    user_id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    category character varying(100),
    difficulty_level character varying(20) DEFAULT 'medium'::character varying,
    target_completion_date date,
    is_completed boolean DEFAULT false,
    completion_date timestamp with time zone,
    progress_percentage integer DEFAULT 0,
    points_reward integer DEFAULT 0,
    is_public boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT goals_progress_percentage_check CHECK (((progress_percentage >= 0) AND (progress_percentage <= 100)))
);


ALTER TABLE public.goals OWNER TO skillwise_user;

--
-- Name: goals_id_seq; Type: SEQUENCE; Schema: public; Owner: skillwise_user
--

CREATE SEQUENCE public.goals_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.goals_id_seq OWNER TO skillwise_user;

--
-- Name: goals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: skillwise_user
--

ALTER SEQUENCE public.goals_id_seq OWNED BY public.goals.id;


--
-- Name: leaderboard; Type: TABLE; Schema: public; Owner: skillwise_user
--

CREATE TABLE public.leaderboard (
    id integer NOT NULL,
    user_id integer NOT NULL,
    timeframe character varying(20) NOT NULL,
    rank_position integer NOT NULL,
    points integer DEFAULT 0 NOT NULL,
    challenges_completed integer DEFAULT 0,
    goals_completed integer DEFAULT 0,
    period_start date NOT NULL,
    period_end date NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.leaderboard OWNER TO skillwise_user;

--
-- Name: leaderboard_id_seq; Type: SEQUENCE; Schema: public; Owner: skillwise_user
--

CREATE SEQUENCE public.leaderboard_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.leaderboard_id_seq OWNER TO skillwise_user;

--
-- Name: leaderboard_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: skillwise_user
--

ALTER SEQUENCE public.leaderboard_id_seq OWNED BY public.leaderboard.id;


--
-- Name: migrations; Type: TABLE; Schema: public; Owner: skillwise_user
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    filename character varying(255) NOT NULL,
    executed_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.migrations OWNER TO skillwise_user;

--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: skillwise_user
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.migrations_id_seq OWNER TO skillwise_user;

--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: skillwise_user
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- Name: peer_reviews; Type: TABLE; Schema: public; Owner: skillwise_user
--

CREATE TABLE public.peer_reviews (
    id integer NOT NULL,
    reviewer_id integer NOT NULL,
    reviewee_id integer NOT NULL,
    submission_id integer NOT NULL,
    review_text text NOT NULL,
    rating integer,
    criteria_scores jsonb,
    time_spent_minutes integer,
    is_anonymous boolean DEFAULT true,
    is_completed boolean DEFAULT false,
    completed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT peer_reviews_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


ALTER TABLE public.peer_reviews OWNER TO skillwise_user;

--
-- Name: peer_reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: skillwise_user
--

CREATE SEQUENCE public.peer_reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.peer_reviews_id_seq OWNER TO skillwise_user;

--
-- Name: peer_reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: skillwise_user
--

ALTER SEQUENCE public.peer_reviews_id_seq OWNED BY public.peer_reviews.id;


--
-- Name: progress_events; Type: TABLE; Schema: public; Owner: skillwise_user
--

CREATE TABLE public.progress_events (
    id integer NOT NULL,
    user_id integer NOT NULL,
    event_type character varying(50) NOT NULL,
    event_data jsonb,
    points_earned integer DEFAULT 0,
    related_goal_id integer,
    related_challenge_id integer,
    related_submission_id integer,
    session_id character varying(255),
    timestamp_occurred timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.progress_events OWNER TO skillwise_user;

--
-- Name: progress_events_id_seq; Type: SEQUENCE; Schema: public; Owner: skillwise_user
--

CREATE SEQUENCE public.progress_events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.progress_events_id_seq OWNER TO skillwise_user;

--
-- Name: progress_events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: skillwise_user
--

ALTER SEQUENCE public.progress_events_id_seq OWNED BY public.progress_events.id;


--
-- Name: refresh_tokens; Type: TABLE; Schema: public; Owner: skillwise_user
--

CREATE TABLE public.refresh_tokens (
    id integer NOT NULL,
    token character varying(255) NOT NULL,
    user_id integer NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    is_revoked boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.refresh_tokens OWNER TO skillwise_user;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: skillwise_user
--

CREATE SEQUENCE public.refresh_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.refresh_tokens_id_seq OWNER TO skillwise_user;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: skillwise_user
--

ALTER SEQUENCE public.refresh_tokens_id_seq OWNED BY public.refresh_tokens.id;


--
-- Name: submissions; Type: TABLE; Schema: public; Owner: skillwise_user
--

CREATE TABLE public.submissions (
    id integer NOT NULL,
    user_id integer NOT NULL,
    challenge_id integer NOT NULL,
    submission_text text NOT NULL,
    submission_files jsonb,
    status character varying(20) DEFAULT 'submitted'::character varying,
    score integer,
    attempt_number integer DEFAULT 1,
    time_spent_minutes integer,
    submitted_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    graded_at timestamp with time zone,
    graded_by integer,
    feedback text,
    is_flagged boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT submissions_score_check CHECK (((score >= 0) AND (score <= 100)))
);


ALTER TABLE public.submissions OWNER TO skillwise_user;

--
-- Name: submissions_id_seq; Type: SEQUENCE; Schema: public; Owner: skillwise_user
--

CREATE SEQUENCE public.submissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.submissions_id_seq OWNER TO skillwise_user;

--
-- Name: submissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: skillwise_user
--

ALTER SEQUENCE public.submissions_id_seq OWNED BY public.submissions.id;


--
-- Name: user_achievements; Type: TABLE; Schema: public; Owner: skillwise_user
--

CREATE TABLE public.user_achievements (
    id integer NOT NULL,
    user_id integer NOT NULL,
    achievement_id integer NOT NULL,
    earned_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    progress_data jsonb,
    is_displayed boolean DEFAULT true
);


ALTER TABLE public.user_achievements OWNER TO skillwise_user;

--
-- Name: user_achievements_id_seq; Type: SEQUENCE; Schema: public; Owner: skillwise_user
--

CREATE SEQUENCE public.user_achievements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_achievements_id_seq OWNER TO skillwise_user;

--
-- Name: user_achievements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: skillwise_user
--

ALTER SEQUENCE public.user_achievements_id_seq OWNED BY public.user_achievements.id;


--
-- Name: user_statistics; Type: TABLE; Schema: public; Owner: skillwise_user
--

CREATE TABLE public.user_statistics (
    id integer NOT NULL,
    user_id integer NOT NULL,
    total_points integer DEFAULT 0,
    total_challenges_completed integer DEFAULT 0,
    total_goals_completed integer DEFAULT 0,
    total_peer_reviews_given integer DEFAULT 0,
    total_peer_reviews_received integer DEFAULT 0,
    average_score numeric(5,2) DEFAULT 0,
    current_streak_days integer DEFAULT 0,
    longest_streak_days integer DEFAULT 0,
    total_time_spent_minutes integer DEFAULT 0,
    level integer DEFAULT 1,
    experience_points integer DEFAULT 0,
    rank_position integer,
    last_activity_date date,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.user_statistics OWNER TO skillwise_user;

--
-- Name: user_statistics_id_seq; Type: SEQUENCE; Schema: public; Owner: skillwise_user
--

CREATE SEQUENCE public.user_statistics_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_statistics_id_seq OWNER TO skillwise_user;

--
-- Name: user_statistics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: skillwise_user
--

ALTER SEQUENCE public.user_statistics_id_seq OWNED BY public.user_statistics.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: skillwise_user
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    profile_image character varying(255),
    bio text,
    is_active boolean DEFAULT true,
    is_verified boolean DEFAULT false,
    role character varying(20) DEFAULT 'student'::character varying,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    last_login timestamp with time zone
);


ALTER TABLE public.users OWNER TO skillwise_user;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: skillwise_user
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO skillwise_user;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: skillwise_user
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: achievements id; Type: DEFAULT; Schema: public; Owner: skillwise_user
--

ALTER TABLE ONLY public.achievements ALTER COLUMN id SET DEFAULT nextval('public.achievements_id_seq'::regclass);


--
-- Name: ai_feedback id; Type: DEFAULT; Schema: public; Owner: skillwise_user
--

ALTER TABLE ONLY public.ai_feedback ALTER COLUMN id SET DEFAULT nextval('public.ai_feedback_id_seq'::regclass);


--
-- Name: challenges id; Type: DEFAULT; Schema: public; Owner: skillwise_user
--

ALTER TABLE ONLY public.challenges ALTER COLUMN id SET DEFAULT nextval('public.challenges_id_seq'::regclass);


--
-- Name: goals id; Type: DEFAULT; Schema: public; Owner: skillwise_user
--

ALTER TABLE ONLY public.goals ALTER COLUMN id SET DEFAULT nextval('public.goals_id_seq'::regclass);


--
-- Name: leaderboard id; Type: DEFAULT; Schema: public; Owner: skillwise_user
--

ALTER TABLE ONLY public.leaderboard ALTER COLUMN id SET DEFAULT nextval('public.leaderboard_id_seq'::regclass);


--
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: skillwise_user
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- Name: peer_reviews id; Type: DEFAULT; Schema: public; Owner: skillwise_user
--

ALTER TABLE ONLY public.peer_reviews ALTER COLUMN id SET DEFAULT nextval('public.peer_reviews_id_seq'::regclass);


--
-- Name: progress_events id; Type: DEFAULT; Schema: public; Owner: skillwise_user
--

ALTER TABLE ONLY public.progress_events ALTER COLUMN id SET DEFAULT nextval('public.progress_events_id_seq'::regclass);


--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: public; Owner: skillwise_user
--

ALTER TABLE ONLY public.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('public.refresh_tokens_id_seq'::regclass);


--
-- Name: submissions id; Type: DEFAULT; Schema: public; Owner: skillwise_user
--

ALTER TABLE ONLY public.submissions ALTER COLUMN id SET DEFAULT nextval('public.submissions_id_seq'::regclass);


--
-- Name: user_achievements id; Type: DEFAULT; Schema: public; Owner: skillwise_user
--

ALTER TABLE ONLY public.user_achievements ALTER COLUMN id SET DEFAULT nextval('public.user_achievements_id_seq'::regclass);


--
-- Name: user_statistics id; Type: DEFAULT; Schema: public; Owner: skillwise_user
--

ALTER TABLE ONLY public.user_statistics ALTER COLUMN id SET DEFAULT nextval('public.user_statistics_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: skillwise_user
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: achievements; Type: TABLE DATA; Schema: public; Owner: skillwise_user
--

COPY public.achievements (id, name, description, category, badge_icon, points_reward, criteria, is_active, rarity, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: ai_feedback; Type: TABLE DATA; Schema: public; Owner: skillwise_user
--

COPY public.ai_feedback (id, submission_id, feedback_text, feedback_type, confidence_score, suggestions, strengths, improvements, ai_model, processing_time_ms, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: challenges; Type: TABLE DATA; Schema: public; Owner: skillwise_user
--

COPY public.challenges (id, title, description, instructions, category, difficulty_level, estimated_time_minutes, points_reward, max_attempts, requires_peer_review, is_active, created_by, tags, prerequisites, learning_objectives, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: goals; Type: TABLE DATA; Schema: public; Owner: skillwise_user
--

COPY public.goals (id, user_id, title, description, category, difficulty_level, target_completion_date, is_completed, completion_date, progress_percentage, points_reward, is_public, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: leaderboard; Type: TABLE DATA; Schema: public; Owner: skillwise_user
--

COPY public.leaderboard (id, user_id, timeframe, rank_position, points, challenges_completed, goals_completed, period_start, period_end, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: skillwise_user
--

COPY public.migrations (id, filename, executed_at) FROM stdin;
1	001_create_users.sql	2025-10-26 06:15:39.95875+00
2	002_create_refresh_tokens.sql	2025-10-26 06:15:39.981734+00
3	003_create_goals.sql	2025-10-26 06:15:40.013063+00
4	004_create_challenges.sql	2025-10-26 06:15:40.039327+00
5	005_create_submissions.sql	2025-10-26 06:15:40.066997+00
6	006_create_ai_feedback.sql	2025-10-26 06:15:40.089298+00
7	007_create_peer_reviews.sql	2025-10-26 06:15:40.117729+00
8	008_create_progress_events.sql	2025-10-26 06:15:40.14746+00
9	009_create_user_statistics.sql	2025-10-26 06:15:40.170605+00
10	010_create_leaderboard.sql	2025-10-26 06:15:40.194528+00
11	011_create_achievements.sql	2025-10-26 06:15:40.231492+00
\.


--
-- Data for Name: peer_reviews; Type: TABLE DATA; Schema: public; Owner: skillwise_user
--

COPY public.peer_reviews (id, reviewer_id, reviewee_id, submission_id, review_text, rating, criteria_scores, time_spent_minutes, is_anonymous, is_completed, completed_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: progress_events; Type: TABLE DATA; Schema: public; Owner: skillwise_user
--

COPY public.progress_events (id, user_id, event_type, event_data, points_earned, related_goal_id, related_challenge_id, related_submission_id, session_id, timestamp_occurred, created_at) FROM stdin;
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: public; Owner: skillwise_user
--

COPY public.refresh_tokens (id, token, user_id, expires_at, is_revoked, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: submissions; Type: TABLE DATA; Schema: public; Owner: skillwise_user
--

COPY public.submissions (id, user_id, challenge_id, submission_text, submission_files, status, score, attempt_number, time_spent_minutes, submitted_at, graded_at, graded_by, feedback, is_flagged, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: user_achievements; Type: TABLE DATA; Schema: public; Owner: skillwise_user
--

COPY public.user_achievements (id, user_id, achievement_id, earned_at, progress_data, is_displayed) FROM stdin;
\.


--
-- Data for Name: user_statistics; Type: TABLE DATA; Schema: public; Owner: skillwise_user
--

COPY public.user_statistics (id, user_id, total_points, total_challenges_completed, total_goals_completed, total_peer_reviews_given, total_peer_reviews_received, average_score, current_streak_days, longest_streak_days, total_time_spent_minutes, level, experience_points, rank_position, last_activity_date, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: skillwise_user
--

COPY public.users (id, email, password_hash, first_name, last_name, profile_image, bio, is_active, is_verified, role, created_at, updated_at, last_login) FROM stdin;
\.


--
-- Name: achievements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: skillwise_user
--

SELECT pg_catalog.setval('public.achievements_id_seq', 1, false);


--
-- Name: ai_feedback_id_seq; Type: SEQUENCE SET; Schema: public; Owner: skillwise_user
--

SELECT pg_catalog.setval('public.ai_feedback_id_seq', 1, false);


--
-- Name: challenges_id_seq; Type: SEQUENCE SET; Schema: public; Owner: skillwise_user
--

SELECT pg_catalog.setval('public.challenges_id_seq', 1, false);


--
-- Name: goals_id_seq; Type: SEQUENCE SET; Schema: public; Owner: skillwise_user
--

SELECT pg_catalog.setval('public.goals_id_seq', 1, false);


--
-- Name: leaderboard_id_seq; Type: SEQUENCE SET; Schema: public; Owner: skillwise_user
--

SELECT pg_catalog.setval('public.leaderboard_id_seq', 1, false);


--
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: skillwise_user
--

SELECT pg_catalog.setval('public.migrations_id_seq', 11, true);


--
-- Name: peer_reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: skillwise_user
--

SELECT pg_catalog.setval('public.peer_reviews_id_seq', 1, false);


--
-- Name: progress_events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: skillwise_user
--

SELECT pg_catalog.setval('public.progress_events_id_seq', 1, false);


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: skillwise_user
--

SELECT pg_catalog.setval('public.refresh_tokens_id_seq', 1, false);


--
-- Name: submissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: skillwise_user
--

SELECT pg_catalog.setval('public.submissions_id_seq', 1, false);


--
-- Name: user_achievements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: skillwise_user
--

SELECT pg_catalog.setval('public.user_achievements_id_seq', 1, false);


--
-- Name: user_statistics_id_seq; Type: SEQUENCE SET; Schema: public; Owner: skillwise_user
--

SELECT pg_catalog.setval('public.user_statistics_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: skillwise_user
--

SELECT pg_catalog.setval('public.users_id_seq', 1, false);


--
-- Name: achievements achievements_pkey; Type: CONSTRAINT; Schema: public; Owner: skillwise_user
--

ALTER TABLE ONLY public.achievements
    ADD CONSTRAINT achievements_pkey PRIMARY KEY (id);


--
-- Name: ai_feedback ai_feedback_pkey; Type: CONSTRAINT; Schema: public; Owner: skillwise_user
--

ALTER TABLE ONLY public.ai_feedback
    ADD CONSTRAINT ai_feedback_pkey PRIMARY KEY (id);


--
-- Name: challenges challenges_pkey; Type: CONSTRAINT; Schema: public; Owner: skillwise_user
--

ALTER TABLE ONLY public.challenges
    ADD CONSTRAINT challenges_pkey PRIMARY KEY (id);


--
-- Name: goals goals_pkey; Type: CONSTRAINT; Schema: public; Owner: skillwise_user
--

ALTER TABLE ONLY public.goals
    ADD CONSTRAINT goals_pkey PRIMARY KEY (id);


--
-- Name: leaderboard leaderboard_pkey; Type: CONSTRAINT; Schema: public; Owner: skillwise_user
--

ALTER TABLE ONLY public.leaderboard
    ADD CONSTRAINT leaderboard_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: skillwise_user
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: peer_reviews peer_reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: skillwise_user
--

ALTER TABLE ONLY public.peer_reviews
    ADD CONSTRAINT peer_reviews_pkey PRIMARY KEY (id);


--
-- Name: progress_events progress_events_pkey; Type: CONSTRAINT; Schema: public; Owner: skillwise_user
--

ALTER TABLE ONLY public.progress_events
    ADD CONSTRAINT progress_events_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: skillwise_user
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_token_key; Type: CONSTRAINT; Schema: public; Owner: skillwise_user
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_key UNIQUE (token);


--
-- Name: submissions submissions_pkey; Type: CONSTRAINT; Schema: public; Owner: skillwise_user
--

ALTER TABLE ONLY public.submissions
    ADD CONSTRAINT submissions_pkey PRIMARY KEY (id);


--
-- Name: user_achievements user_achievements_pkey; Type: CONSTRAINT; Schema: public; Owner: skillwise_user
--

ALTER TABLE ONLY public.user_achievements
    ADD CONSTRAINT user_achievements_pkey PRIMARY KEY (id);


--
-- Name: user_statistics user_statistics_pkey; Type: CONSTRAINT; Schema: public; Owner: skillwise_user
--

ALTER TABLE ONLY public.user_statistics
    ADD CONSTRAINT user_statistics_pkey PRIMARY KEY (id);


--
-- Name: user_statistics user_statistics_user_id_key; Type: CONSTRAINT; Schema: public; Owner: skillwise_user
--

ALTER TABLE ONLY public.user_statistics
    ADD CONSTRAINT user_statistics_user_id_key UNIQUE (user_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: skillwise_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: skillwise_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_achievements_category; Type: INDEX; Schema: public; Owner: skillwise_user
--

CREATE INDEX idx_achievements_category ON public.achievements USING btree (category);


--
-- Name: idx_achievements_is_active; Type: INDEX; Schema: public; Owner: skillwise_user
--

CREATE INDEX idx_achievements_is_active ON public.achievements USING btree (is_active);


--
-- Name: idx_achievements_rarity; Type: INDEX; Schema: public; Owner: skillwise_user
--

CREATE INDEX idx_achievements_rarity ON public.achievements USING btree (rarity);


--
-- Name: idx_ai_feedback_created_at; Type: INDEX; Schema: public; Owner: skillwise_user
--

CREATE INDEX idx_ai_feedback_created_at ON public.ai_feedback USING btree (created_at);


--
-- Name: idx_ai_feedback_submission_id; Type: INDEX; Schema: public; Owner: skillwise_user
--

CREATE INDEX idx_ai_feedback_submission_id ON public.ai_feedback USING btree (submission_id);


--
-- Name: idx_ai_feedback_type; Type: INDEX; Schema: public; Owner: skillwise_user
--

CREATE INDEX idx_ai_feedback_type ON public.ai_feedback USING btree (feedback_type);


--
-- Name: idx_challenges_category; Type: INDEX; Schema: public; Owner: skillwise_user
--

CREATE INDEX idx_challenges_category ON public.challenges USING btree (category);


--
-- Name: idx_challenges_created_by; Type: INDEX; Schema: public; Owner: skillwise_user
--

CREATE INDEX idx_challenges_created_by ON public.challenges USING btree (created_by);


--
-- Name: idx_challenges_difficulty; Type: INDEX; Schema: public; Owner: skillwise_user
--

CREATE INDEX idx_challenges_difficulty ON public.challenges USING btree (difficulty_level);


--
-- Name: idx_challenges_is_active; Type: INDEX; Schema: public; Owner: skillwise_user
--

CREATE INDEX idx_challenges_is_active ON public.challenges USING btree (is_active);


--
-- Name: idx_challenges_tags; Type: INDEX; Schema: public; Owner: skillwise_user
--

CREATE INDEX idx_challenges_tags ON public.challenges USING gin (tags);


--
-- Name: idx_goals_category; Type: INDEX; Schema: public; Owner: skillwise_user
--

CREATE INDEX idx_goals_category ON public.goals USING btree (category);


--
-- Name: idx_goals_completion_date; Type: INDEX; Schema: public; Owner: skillwise_user
--

CREATE INDEX idx_goals_completion_date ON public.goals USING btree (completion_date);


--
-- Name: idx_goals_difficulty; Type: INDEX; Schema: public; Owner: skillwise_user
--

CREATE INDEX idx_goals_difficulty ON public.goals USING btree (difficulty_level);


--
-- Name: idx_goals_is_completed; Type: INDEX; Schema: public; Owner: skillwise_user
--

CREATE INDEX idx_goals_is_completed ON public.goals USING btree (is_completed);


--
-- Name: idx_goals_user_id; Type: INDEX; Schema: public; Owner: skillwise_user
--

CREATE INDEX idx_goals_user_id ON public.goals USING btree (user_id);


--
-- Name: idx_leaderboard_period; Type: INDEX; Schema: public; Owner: skillwise_user
--

CREATE INDEX idx_leaderboard_period ON public.leaderboard USING btree (period_start, period_end);


--
-- Name: idx_leaderboard_points; Type: INDEX; Schema: public; Owner: skillwise_user
--

CREATE INDEX idx_leaderboard_points ON public.leaderboard USING btree (timeframe, points DESC);


--
-- Name: idx_leaderboard_rank; Type: INDEX; Schema: public; Owner: skillwise_user
--

CREATE INDEX idx_leaderboard_rank ON public.leaderboard USING btree (timeframe, rank_position);


--
-- Name: idx_leaderboard_unique_period; Type: INDEX; Schema: public; Owner: skillwise_user
--

CREATE UNIQUE INDEX idx_leaderboard_unique_period ON public.leaderboard USING btree (user_id, timeframe, period_start);


--
-- Name: idx_leaderboard_user_timeframe; Type: INDEX; Schema: public; Owner: skillwise_user
--

CREATE INDEX idx_leaderboard_user_timeframe ON public.leaderboard USING btree (user_id, timeframe);


--
-- Name: idx_peer_reviews_is_completed; Type: INDEX; Schema: public; Owner: skillwise_user
--

CREATE INDEX idx_peer_reviews_is_completed ON public.peer_reviews USING btree (is_completed);


--
-- Name: idx_peer_reviews_reviewee_id; Type: INDEX; Schema: public; Owner: skillwise_user
--

CREATE INDEX idx_peer_reviews_reviewee_id ON public.peer_reviews USING btree (reviewee_id);


--
-- Name: idx_peer_reviews_reviewer_id; Type: INDEX; Schema: public; Owner: skillwise_user
--

CREATE INDEX idx_peer_reviews_reviewer_id ON public.peer_reviews USING btree (reviewer_id);


--
-- Name: idx_peer_reviews_submission_id; Type: INDEX; Schema: public; Owner: skillwise_user
--

CREATE INDEX idx_peer_reviews_submission_id ON public.peer_reviews USING btree (submission_id);


--
-- Name: idx_peer_reviews_unique; Type: INDEX; Schema: public; Owner: skillwise_user
--

CREATE UNIQUE INDEX idx_peer_reviews_unique ON public.peer_reviews USING btree (reviewer_id, submission_id);


--
-- Name: idx_progress_events_challenge_id; Type: INDEX; Schema: public; Owner: skillwise_user
--

CREATE INDEX idx_progress_events_challenge_id ON public.progress_events USING btree (related_challenge_id);


--
-- Name: idx_progress_events_data; Type: INDEX; Schema: public; Owner: skillwise_user
--

CREATE INDEX idx_progress_events_data ON public.progress_events USING gin (event_data);


--
-- Name: idx_progress_events_goal_id; Type: INDEX; Schema: public; Owner: skillwise_user
--

CREATE INDEX idx_progress_events_goal_id ON public.progress_events USING btree (related_goal_id);


--
-- Name: idx_progress_events_session; Type: INDEX; Schema: public; Owner: skillwise_user
--

CREATE INDEX idx_progress_events_session ON public.progress_events USING btree (session_id);


--
-- Name: idx_progress_events_timestamp; Type: INDEX; Schema: public; Owner: skillwise_user
--

CREATE INDEX idx_progress_events_timestamp ON public.progress_events USING btree (timestamp_occurred);


--
-- Name: idx_progress_events_type; Type: INDEX; Schema: public; Owner: skillwise_user
--

CREATE INDEX idx_progress_events_type ON public.progress_events USING btree (event_type);


--
-- Name: idx_progress_events_user_id; Type: INDEX; Schema: public; Owner: skillwise_user
--

CREATE INDEX idx_progress_events_user_id ON public.progress_events USING btree (user_id);


--
-- Name: idx_refresh_tokens_expires_at; Type: INDEX; Schema: public; Owner: skillwise_user
--

CREATE INDEX idx_refresh_tokens_expires_at ON public.refresh_tokens USING btree (expires_at);


--
-- Name: idx_refresh_tokens_token; Type: INDEX; Schema: public; Owner: skillwise_user
--

CREATE INDEX idx_refresh_tokens_token ON public.refresh_tokens USING btree (token);


--
-- Name: idx_refresh_tokens_user_id; Type: INDEX; Schema: public; Owner: skillwise_user
--

CREATE INDEX idx_refresh_tokens_user_id ON public.refresh_tokens USING btree (user_id);


--
-- Name: idx_submissions_challenge_id; Type: INDEX; Schema: public; Owner: skillwise_user
--

CREATE INDEX idx_submissions_challenge_id ON public.submissions USING btree (challenge_id);


--
-- Name: idx_submissions_status; Type: INDEX; Schema: public; Owner: skillwise_user
--

CREATE INDEX idx_submissions_status ON public.submissions USING btree (status);


--
-- Name: idx_submissions_submitted_at; Type: INDEX; Schema: public; Owner: skillwise_user
--

CREATE INDEX idx_submissions_submitted_at ON public.submissions USING btree (submitted_at);


--
-- Name: idx_submissions_user_challenge_attempt; Type: INDEX; Schema: public; Owner: skillwise_user
--

CREATE UNIQUE INDEX idx_submissions_user_challenge_attempt ON public.submissions USING btree (user_id, challenge_id, attempt_number);


--
-- Name: idx_submissions_user_id; Type: INDEX; Schema: public; Owner: skillwise_user
--

CREATE INDEX idx_submissions_user_id ON public.submissions USING btree (user_id);


--
-- Name: idx_user_achievements_achievement_id; Type: INDEX; Schema: public; Owner: skillwise_user
--

CREATE INDEX idx_user_achievements_achievement_id ON public.user_achievements USING btree (achievement_id);


--
-- Name: idx_user_achievements_earned_at; Type: INDEX; Schema: public; Owner: skillwise_user
--

CREATE INDEX idx_user_achievements_earned_at ON public.user_achievements USING btree (earned_at);


--
-- Name: idx_user_achievements_unique; Type: INDEX; Schema: public; Owner: skillwise_user
--

CREATE UNIQUE INDEX idx_user_achievements_unique ON public.user_achievements USING btree (user_id, achievement_id);


--
-- Name: idx_user_achievements_user_id; Type: INDEX; Schema: public; Owner: skillwise_user
--

CREATE INDEX idx_user_achievements_user_id ON public.user_achievements USING btree (user_id);


--
-- Name: idx_user_stats_activity; Type: INDEX; Schema: public; Owner: skillwise_user
--

CREATE INDEX idx_user_stats_activity ON public.user_statistics USING btree (last_activity_date);


--
-- Name: idx_user_stats_level; Type: INDEX; Schema: public; Owner: skillwise_user
--

CREATE INDEX idx_user_stats_level ON public.user_statistics USING btree (level DESC);


--
-- Name: idx_user_stats_rank; Type: INDEX; Schema: public; Owner: skillwise_user
--

CREATE INDEX idx_user_stats_rank ON public.user_statistics USING btree (rank_position);


--
-- Name: idx_user_stats_total_points; Type: INDEX; Schema: public; Owner: skillwise_user
--

CREATE INDEX idx_user_stats_total_points ON public.user_statistics USING btree (total_points DESC);


--
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: skillwise_user
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- Name: idx_users_is_active; Type: INDEX; Schema: public; Owner: skillwise_user
--

CREATE INDEX idx_users_is_active ON public.users USING btree (is_active);


--
-- Name: idx_users_role; Type: INDEX; Schema: public; Owner: skillwise_user
--

CREATE INDEX idx_users_role ON public.users USING btree (role);


--
-- Name: achievements update_achievements_updated_at; Type: TRIGGER; Schema: public; Owner: skillwise_user
--

CREATE TRIGGER update_achievements_updated_at BEFORE UPDATE ON public.achievements FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: ai_feedback update_ai_feedback_updated_at; Type: TRIGGER; Schema: public; Owner: skillwise_user
--

CREATE TRIGGER update_ai_feedback_updated_at BEFORE UPDATE ON public.ai_feedback FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: challenges update_challenges_updated_at; Type: TRIGGER; Schema: public; Owner: skillwise_user
--

CREATE TRIGGER update_challenges_updated_at BEFORE UPDATE ON public.challenges FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: goals update_goals_updated_at; Type: TRIGGER; Schema: public; Owner: skillwise_user
--

CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON public.goals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: leaderboard update_leaderboard_updated_at; Type: TRIGGER; Schema: public; Owner: skillwise_user
--

CREATE TRIGGER update_leaderboard_updated_at BEFORE UPDATE ON public.leaderboard FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: peer_reviews update_peer_reviews_updated_at; Type: TRIGGER; Schema: public; Owner: skillwise_user
--

CREATE TRIGGER update_peer_reviews_updated_at BEFORE UPDATE ON public.peer_reviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: refresh_tokens update_refresh_tokens_updated_at; Type: TRIGGER; Schema: public; Owner: skillwise_user
--

CREATE TRIGGER update_refresh_tokens_updated_at BEFORE UPDATE ON public.refresh_tokens FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: submissions update_submissions_updated_at; Type: TRIGGER; Schema: public; Owner: skillwise_user
--

CREATE TRIGGER update_submissions_updated_at BEFORE UPDATE ON public.submissions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: user_statistics update_user_statistics_updated_at; Type: TRIGGER; Schema: public; Owner: skillwise_user
--

CREATE TRIGGER update_user_statistics_updated_at BEFORE UPDATE ON public.user_statistics FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: users update_users_updated_at; Type: TRIGGER; Schema: public; Owner: skillwise_user
--

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: ai_feedback ai_feedback_submission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: skillwise_user
--

ALTER TABLE ONLY public.ai_feedback
    ADD CONSTRAINT ai_feedback_submission_id_fkey FOREIGN KEY (submission_id) REFERENCES public.submissions(id) ON DELETE CASCADE;


--
-- Name: challenges challenges_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: skillwise_user
--

ALTER TABLE ONLY public.challenges
    ADD CONSTRAINT challenges_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: goals goals_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: skillwise_user
--

ALTER TABLE ONLY public.goals
    ADD CONSTRAINT goals_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: leaderboard leaderboard_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: skillwise_user
--

ALTER TABLE ONLY public.leaderboard
    ADD CONSTRAINT leaderboard_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: peer_reviews peer_reviews_reviewee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: skillwise_user
--

ALTER TABLE ONLY public.peer_reviews
    ADD CONSTRAINT peer_reviews_reviewee_id_fkey FOREIGN KEY (reviewee_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: peer_reviews peer_reviews_reviewer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: skillwise_user
--

ALTER TABLE ONLY public.peer_reviews
    ADD CONSTRAINT peer_reviews_reviewer_id_fkey FOREIGN KEY (reviewer_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: peer_reviews peer_reviews_submission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: skillwise_user
--

ALTER TABLE ONLY public.peer_reviews
    ADD CONSTRAINT peer_reviews_submission_id_fkey FOREIGN KEY (submission_id) REFERENCES public.submissions(id) ON DELETE CASCADE;


--
-- Name: progress_events progress_events_related_challenge_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: skillwise_user
--

ALTER TABLE ONLY public.progress_events
    ADD CONSTRAINT progress_events_related_challenge_id_fkey FOREIGN KEY (related_challenge_id) REFERENCES public.challenges(id);


--
-- Name: progress_events progress_events_related_goal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: skillwise_user
--

ALTER TABLE ONLY public.progress_events
    ADD CONSTRAINT progress_events_related_goal_id_fkey FOREIGN KEY (related_goal_id) REFERENCES public.goals(id);


--
-- Name: progress_events progress_events_related_submission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: skillwise_user
--

ALTER TABLE ONLY public.progress_events
    ADD CONSTRAINT progress_events_related_submission_id_fkey FOREIGN KEY (related_submission_id) REFERENCES public.submissions(id);


--
-- Name: progress_events progress_events_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: skillwise_user
--

ALTER TABLE ONLY public.progress_events
    ADD CONSTRAINT progress_events_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: skillwise_user
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: submissions submissions_challenge_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: skillwise_user
--

ALTER TABLE ONLY public.submissions
    ADD CONSTRAINT submissions_challenge_id_fkey FOREIGN KEY (challenge_id) REFERENCES public.challenges(id) ON DELETE CASCADE;


--
-- Name: submissions submissions_graded_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: skillwise_user
--

ALTER TABLE ONLY public.submissions
    ADD CONSTRAINT submissions_graded_by_fkey FOREIGN KEY (graded_by) REFERENCES public.users(id);


--
-- Name: submissions submissions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: skillwise_user
--

ALTER TABLE ONLY public.submissions
    ADD CONSTRAINT submissions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_achievements user_achievements_achievement_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: skillwise_user
--

ALTER TABLE ONLY public.user_achievements
    ADD CONSTRAINT user_achievements_achievement_id_fkey FOREIGN KEY (achievement_id) REFERENCES public.achievements(id) ON DELETE CASCADE;


--
-- Name: user_achievements user_achievements_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: skillwise_user
--

ALTER TABLE ONLY public.user_achievements
    ADD CONSTRAINT user_achievements_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_statistics user_statistics_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: skillwise_user
--

ALTER TABLE ONLY public.user_statistics
    ADD CONSTRAINT user_statistics_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict gPm2uhbqpzHSefEsIjJqQAzckgDN6MJiWooM9XlkK3AfGYLIMxVVXbABadJbcHD

