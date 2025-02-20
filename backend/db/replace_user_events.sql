CREATE OR REPLACE FUNCTION replace_user_events(_user_id UUID, _event_data JSONB)
RETURNS VOID AS $$
BEGIN
    DELETE FROM events WHERE user_id = _user_id;
    
    INSERT INTO events (user_id, start_time, end_time, event_type, day_of_week)
    SELECT
        (e->>'user_id')::UUID,
        (e->>'start_time')::TIMESTAMP,
        (e->>'end_time')::TIMESTAMP,
        e->>'event_type',
        (e->>'day_of_week')::INT
    FROM jsonb_array_elements(_event_data) AS e;

EXCEPTION
    WHEN OTHERS THEN
        RAISE;
END;
$$ LANGUAGE plpgsql;
