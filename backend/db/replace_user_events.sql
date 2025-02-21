CREATE OR REPLACE FUNCTION replace_user_events(_user_id UUID, _event_data JSONB)
RETURNS VOID AS $$
BEGIN
    DELETE FROM events WHERE user_id = _user_id;
    
    INSERT INTO events (user_id, calendar_id, start_date, end_date, start_time, end_time, day_of_week, event_type)
    SELECT
        (e->>'user_id')::UUID,
        e->>'calendar_id',
        NULLIF(e->>'start_date', 'null')::TIMESTAMP,
        NULLIF(e->>'end_date', 'null')::TIMESTAMP,
        NULLIF(e->>'start_time', 'null')::TIME,
        NULLIF(e->>'end_time', 'null')::TIME,  
        NULLIF(e->>'day_of_week', 'null')::INT,
        e->>'event_type'
    FROM jsonb_array_elements(_event_data) AS e;

EXCEPTION
    WHEN OTHERS THEN
        RAISE;
END;
$$ LANGUAGE plpgsql;
