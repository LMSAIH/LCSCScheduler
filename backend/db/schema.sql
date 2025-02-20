CREATE TABLE events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    day_of_week INT CHECK (day_of_week BETWEEN 0 AND 6),
    event_type TEXT NOT NULL CHECK (event_type IN ('Permanent', 'Temporary'))
);