# API Server

## Overview

This Flask API serves as the communication bridge between the mobile application and the data processing components of the project. It facilitates the exchange of data between the local machine, which runs the machine learning model and stores necessary information, and the mobile application. By using this API, the mobile app can access real-time data and configurations from the local server.

Start the API server:
```bash
python flaskapi.py
```

## Database Structure

We utilize SQLite for the database that stores emergency contacts and camera settings. The database schema is defined in [DB Tables Structure](./db/sql.sql).
