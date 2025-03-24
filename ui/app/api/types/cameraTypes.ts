export type Camera = {
  id: number;
  name: string;
  username: string;
  password: string;
  stream_url: string;
  fall_detection_enabled: number;
  inactivity_detection_enabled: number;
  send_image_with_alert: number;
  fall_detection_start_time: string;
  fall_detection_end_time: string;
  inactivity_detection_start_time: string;
  inactivity_detection_end_time: string;
  inactivity_detection_sensitivity: number;
  inactivity_detection_duration: number; 
  created_at: string;
  updated_at: string;
};

export type NewCamera = Omit<Camera, "id" | "created_at" | "updated_at">;
