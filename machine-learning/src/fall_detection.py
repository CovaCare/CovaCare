import numpy as np
from collections import deque
import tensorflow as tf
import os
import time
from config import ( MODEL_HIDDEN_SIZE, MODEL_OUTPUT_SIZE, MODEL_L2_REGULARIZATION, MODEL_RECURRENT_DROPOUT, 
                     MODEL_DROPOUT, FALL_INPUT_SIZE, FALL_WINDOW_SIZE, FALL_PREDICTION_HISTORY_SIZE, 
                     FALL_1_AND_3_THRESHOLD, FALL_2_THRESHOLD, FALL_EXPECTED_FRAME_RATE, ENFORCE_REALTIME )

@tf.keras.utils.register_keras_serializable()
class FallDetectionLSTM(tf.keras.Model):
    def __init__(self, hidden_size=MODEL_HIDDEN_SIZE, output_size=MODEL_OUTPUT_SIZE, **kwargs):
        super().__init__(**kwargs)
        self.lstm = tf.keras.layers.LSTM(hidden_size, return_sequences=False, 
                                         kernel_regularizer=tf.keras.regularizers.l2(MODEL_L2_REGULARIZATION),
                                         recurrent_dropout=MODEL_RECURRENT_DROPOUT)
        self.dropout = tf.keras.layers.Dropout(MODEL_DROPOUT)
        self.fc = tf.keras.layers.Dense(output_size, activation='softmax', kernel_regularizer=tf.keras.regularizers.l2(MODEL_L2_REGULARIZATION))

    def call(self, inputs):
        x = self.lstm(inputs)
        x = self.dropout(x)
        return self.fc(x)

    def get_config(self):
        config = super().get_config()
        config.update({'hidden_size': MODEL_HIDDEN_SIZE, 'output_size': MODEL_OUTPUT_SIZE})
        return config

class FallDetector:
    def __init__(self):
        self.pose_data_window = deque(maxlen=FALL_WINDOW_SIZE)
        self.prediction_history = deque(maxlen=FALL_PREDICTION_HISTORY_SIZE)
        self.model = tf.keras.models.load_model(
            os.path.join(os.path.dirname(__file__), 'fall_detection.keras'),
            custom_objects={'FallDetectionLSTM': FallDetectionLSTM}
        )
        self.previous_timestamp = None
        self.expected_frame_rate = FALL_EXPECTED_FRAME_RATE

    def interpolate_keypoints(self, keypoints_data, previous_data, num_missing_frames):
        if previous_data is None or keypoints_data is None:
            return []
        
        interpolated_data_list = []
        
        for i in range(1, num_missing_frames + 1):
            alpha = i / (num_missing_frames + 1)
            
            interpolated_data = [
                previous_data[j] + alpha * (keypoints_data[j] - previous_data[j]) for j in range(len(previous_data))
            ]
            interpolated_data_list.append(interpolated_data)
        
        return interpolated_data_list

    def evaluate_window(self, keypoints_data):
        timestamp = time.time()
        if self.previous_timestamp is None:
            self.previous_timestamp = timestamp
            self.pose_data_window.append(keypoints_data)
            return 0
        
        num_missing_frames = 0

        if ENFORCE_REALTIME:
            time_diff = timestamp - self.previous_timestamp
            frame_interval = 1 / self.expected_frame_rate

            if time_diff > frame_interval:
                num_missing_frames = int(time_diff // frame_interval) - 1
                
                interpolated_data_list = self.interpolate_keypoints(keypoints_data, self.pose_data_window[-1], num_missing_frames)
                
                for interpolated_data in interpolated_data_list:
                    self.pose_data_window.append(interpolated_data)

        # Add the current frame
        self.pose_data_window.append(keypoints_data)
        self.previous_timestamp = timestamp

        if len(self.pose_data_window) == FALL_WINDOW_SIZE:
            sequence_data = np.array(self.pose_data_window).reshape(1, FALL_WINDOW_SIZE, FALL_INPUT_SIZE)
            prediction = self.model.predict(sequence_data, verbose=0)
            fall_class = np.argmax(prediction)
            self.prediction_history.append(fall_class)
            for _ in range(num_missing_frames):
                self.prediction_history.append(fall_class)
            return fall_class
        
        return 0

    def check_history_for_falls(self):
        if len(self.prediction_history) < FALL_PREDICTION_HISTORY_SIZE:
            return False 

        all_class_indices = {i: np.where(np.array(self.prediction_history) == i)[0] for i in range(4)}
        class_mean_index = {i: np.mean(all_class_indices[i]) if len(all_class_indices[i]) > 0 else None for i in range(4)}
        class_count = {i: len(all_class_indices[i]) for i in range(4)}

        # If there are a lot of 2s, return true
        if class_count[2] > FALL_2_THRESHOLD:
            return True
        
        # If there are many 1s followed by many 3s, return true
        if class_count[1] > FALL_1_AND_3_THRESHOLD and class_count[3] > FALL_1_AND_3_THRESHOLD and class_mean_index[1] < class_mean_index[3]:
            return True
        
        return False
    
    def get_history(self):
        return self.prediction_history
