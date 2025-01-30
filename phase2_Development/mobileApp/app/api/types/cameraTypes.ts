export type Camera = {
  id: number;
  name: string;
  username: string;
  password: string;
  stream_url: string;
  fall_detection_enabled: number;
  inactivity_detection_enabled: number;
  created_at: string;
  updated_at: string;
};

export type NewCamera = Omit<Camera, "id" | "created_at" | "updated_at">;
