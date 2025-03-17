import os

BASE_URL = "https://df55-162-253-8-202.ngrok-free.app"

def update_base_url(url):
    """Update the base URL for the image server"""
    global BASE_URL
    BASE_URL = url
    return BASE_URL

def get_base_url():
    """Get the current base URL"""
    return BASE_URL 