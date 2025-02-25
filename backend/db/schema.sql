CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL
);

CREATE TABLE events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    calendar_id VARCHAR(255) NOT NULL,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    start_time TIME,
    end_time TIME,
    day_of_week INT CHECK (day_of_week BETWEEN 0 AND 6),
    event_type VARCHAR(255) NOT NULL CHECK (event_type IN ('Permanent', 'Temporary'))
);