import numpy as np
import pandas as pd
import os
import tensorflow as tf

models = tf.keras.models
layers = tf.keras.layers

class FallDetectionLSTM(models.Model):
    def __init__(self, hidden_size, output_size):
        super(FallDetectionLSTM, self).__init__()
        self.lstm = layers.LSTM(hidden_size, return_sequences=False)
        self.fc = layers.Dense(output_size, activation='sigmoid')

    def call(self, inputs):
        x = self.lstm(inputs)
        return self.fc(x)

input_size = 24  # 12 keypoints * 2 (x, y)
hidden_size = 128
output_size = 1  # Fall (1) or No-fall (0)
num_epochs = 10
batch_size = 1
learning_rate = 0.001
sequence_length = 30  # Fixed sequence length of 30 frames

input_layer = layers.Input(shape=(sequence_length, input_size))

model = FallDetectionLSTM(hidden_size=hidden_size, output_size=output_size)

output = model(input_layer)

full_model = models.Model(inputs=input_layer, outputs=output)

full_model.compile(optimizer=tf.optimizers.Adam(learning_rate), loss='binary_crossentropy', metrics=['accuracy'])

full_model.summary()

csv_folder = 'pose_results'

X_train = []
y_train = []

#Currently only one video (which is a fall)
labels = [1] 

# Load each CSV file corresponding to a video
for idx, csv_file in enumerate(os.listdir(csv_folder)):
    if csv_file.endswith('.csv'):
        file_path = os.path.join(csv_folder, csv_file)
        data = pd.read_csv(file_path, header=None)
        
        video_data = data.values.reshape(30, 24)

        X_train.append(video_data)
        y_train.append(labels[idx])


X_train = np.array(X_train)
y_train = np.array(y_train)
y_train = y_train.reshape(-1, 1)

print(X_train)
print(y_train)

full_model.fit(X_train, y_train, epochs=num_epochs, batch_size=batch_size)
