BASE_URL = "https://02fe-71-17-226-234.ngrok-free.app"

def update_base_url(url):
    """Update the base URL for the image server"""
    global BASE_URL
    BASE_URL = url
    return BASE_URL

def get_base_url():
    """Get the current base URL"""
    return BASE_URL 