CREATE TABLE contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    status INTEGER NOT NULL CHECK (status IN (0, 1)),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

select * from contacts;


CREATE TABLE cameras (
    id INTEGER PRIMARY KEY AUTOINCREMENT, -- Unique identifier for each camera
    name TEXT NOT NULL, -- Camera name, representing its location (e.g., Living Room, Kitchen)
    username TEXT, -- Username for accessing the camera
    password TEXT, -- Password for accessing the camera
    stream_url TEXT, -- Streaming URL or IP address
    fall_detection_enabled INTEGER NOT NULL CHECK (fall_detection_enabled IN (0, 1)) DEFAULT 0, -- 0 = Disabled, 1 = Enabled
    inactivity_detection_enabled INTEGER NOT NULL CHECK (inactivity_detection_enabled IN (0, 1)) DEFAULT 0, -- 0 = Disabled, 1 = Enabled
    send_image_with_alert INTEGER NOT NULL CHECK (send_image_with_alert IN (0, 1)) DEFAULT 0, -- 0 = Disabled, 1 = Enabled

    fall_detection_start_time TIME, -- Start time for fall detection active hours (e.g., "08:00")
    fall_detection_end_time   TIME, -- End time for fall detection active hours (e.g., "18:00")
    inactivity_detection_start_time TIME, -- Start time for inactivity detection active hours (e.g., "08:00")
    inactivity_detection_end_time   TIME, -- End time for inactivity detection active hours (e.g., "22:00")

    inactivity_detection_sensitivity INTEGER NOT NULL DEFAULT 50, -- 0-100 scale. Higher value = more sensitive to inactivity.
    inactivity_detection_duration INTEGER NOT NULL DEFAULT 30,    -- Duration (in minutes) before system triggers inactivity alert.

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- Timestamp for when the camera was added
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP  -- Timestamp for the last update
);


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
