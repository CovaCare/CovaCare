-- CREATE TABLE contacts (
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--     name TEXT NOT NULL,
--     phone_number TEXT NOT NULL,
--     status INTEGER NOT NULL CHECK (status IN (0, 1))
-- );

-- select * from contacts;


-- CREATE TABLE cameras (
--     id INTEGER PRIMARY KEY AUTOINCREMENT, -- Unique identifier for each camera
--     name TEXT NOT NULL, -- Camera name, representing its location (e.g., Living Room, Kitchen)
--     username TEXT, -- Username for accessing the camera
--     password TEXT, -- Password for accessing the camera
--     stream_url TEXT, -- Streaming URL or IP address
--     fall_detection_enabled INTEGER NOT NULL CHECK (fall_detection_enabled IN (0, 1)) DEFAULT 0, -- 0 = Disabled, 1 = Enabled
--     inactivity_detection_enabled INTEGER NOT NULL CHECK (inactivity_detection_enabled IN (0, 1)) DEFAULT 0, -- 0 = Disabled, 1 = Enabled
--     created_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- Timestamp for when the camera was added
--     updated_at DATETIME DEFAULT CURRENT_TIMESTAMP -- Timestamp for the last update
-- );


-- CREATE TABLE global_settings (
--     id INTEGER PRIMARY KEY AUTOINCREMENT, -- Unique identifier for global settings
--     fall_detection_enabled INTEGER NOT NULL CHECK (fall_detection_enabled IN (0, 1)) DEFAULT 0, -- 0 = Disabled, 1 = Enabled
--     fall_detection_start_time TIME DEFAULT NULL, -- Start time for Fall Detection
--     fall_detection_end_time TIME DEFAULT NULL, -- End time for Fall Detection
--     inactivity_detection_enabled INTEGER NOT NULL CHECK (inactivity_detection_enabled IN (0, 1)) DEFAULT 0, -- 0 = Disabled, 1 = Enabled
--     inactivity_detection_start_time TIME DEFAULT NULL, -- Start time for Inactivity Detection
--     inactivity_detection_end_time TIME DEFAULT NULL, -- End time for Inactivity Detection
--     updated_at DATETIME DEFAULT CURRENT_TIMESTAMP -- Timestamp for the last update
-- );


-- API Testing
-- curl -X POST http://localhost:5000/contacts \
--      -H "Content-Type: application/json" \
--      -d '{"name": "David", "phoneNumber": "13062345678", "status": 1}'

-- curl -X PUT http://localhost:5000/contacts/1 \
--      -H "Content-Type: application/json" \
--      -d '{"name": "David Updated", "phoneNumber": "13062345678", "status": 0}'

-- curl -X DELETE http://localhost:5000/contacts/1
