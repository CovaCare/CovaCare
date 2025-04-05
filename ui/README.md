# Application

The CovaCare mobile application serves as the primary interface for users and caregivers to manage emergency contacts and configure system settings. It is built using **React Native** for cross-platform compatibility, ensuring smooth functionality on both iOS and Android devices.

## Features

- **Emergency Contact Management**  
  Add, edit, activate, or deactivate contacts to receive alerts.

- **Camera Management**  
  Add and manage in-home cameras with customizable monitoring zones.

- **Fall & Inactivity Detection Configuration**  
  Schedule monitoring for specific times or enable full-day detection.

- **Send Images with Alert Option**  
  Toggle image attachments in alerts on or off based on privacy preferences.

- **Test Alert Feature**  
  Send test alerts to verify that emergency contacts are set up correctly.

- **Health Check System**  
  Perform a camera health check and notify contacts with camera status and a live snapshot.

- **Local Video Processing**  
  All video is processed on-device to protect user data—no cloud storage or third-party access.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Install Expo CLI globally:
   ```bash
   npm install -g expo-cli
   ```

3. Start the development server:
   ```bash
   npx expo start
   ```

4. Run on your device:
   - iOS: Scan QR code with Camera app
   - Android: Scan QR code with Expo Go app
   - Press 'i' for iOS simulator
   - Press 'a' for Android emulator
