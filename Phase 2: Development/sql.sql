-- CREATE TABLE contacts (
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--     name TEXT NOT NULL,
--     phone_number TEXT NOT NULL,
--     status INTEGER NOT NULL CHECK (status IN (0, 1))
-- );

-- select * from contacts;


-- CREATE TABLE cameras (
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--     name TEXT NOT NULL,          -- Camera name

--     -- Status indicating if the camera is turned on/off (0 = off/disabled, 1 = on/enabled)
--     status INTEGER NOT NULL CHECK (status IN (0, 1)),
    
--     ip TEXT,                     -- IP address or streaming URL for retrieving the live feed
  
--     -- Separate detection features as booleans (0 = disabled, 1 = enabled)
--     fall_detection_enabled INTEGER NOT NULL CHECK (fall_detection_enabled IN (0, 1)) DEFAULT 1,
--     inactivity_detection_enabled INTEGER NOT NULL CHECK (inactivity_detection_enabled IN (0, 1)) DEFAULT 1,

--     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
--     updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE IF NOT EXISTS settings (
--     camera_id INTEGER PRIMARY KEY,  -- One settings row per camera, referencing cameras.id
--     fall_detection_enabled INTEGER NOT NULL CHECK (fall_detection_enabled IN (0, 1)) DEFAULT 1,
--     inactivity_detection_enabled INTEGER NOT NULL CHECK (inactivity_detection_enabled IN (0, 1)) DEFAULT 1,
--     active_start_time TEXT NOT NULL,  -- e.g., "08:00"
--     active_end_time TEXT NOT NULL,    -- e.g., "20:00"
--     FOREIGN KEY (camera_id) REFERENCES cameras(id) ON DELETE CASCADE
-- );
