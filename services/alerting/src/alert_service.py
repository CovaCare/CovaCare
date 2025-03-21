from twilio.rest import Client
import os
from dotenv import load_dotenv

load_dotenv()

class AlertService:
    def __init__(self):
        account_sid = os.getenv('TWILIO_ACCOUNT_SID')
        auth_token = os.getenv('TWILIO_AUTH_TOKEN')
        self.from_number = os.getenv('TWILIO_FROM_NUMBER')
        self.client = Client(account_sid, auth_token)

    def send_alert(self, to_number, message, media_url=None):
        message_params = {
            'body': message,
            'from_': self.from_number,
            'to': to_number
        }
        
        if media_url:
            message_params['media_url'] = [media_url]
            
        message = self.client.messages.create(**message_params)
        print(f"Message sent from: {self.from_number} to: {to_number}")
        print(f"Message content: {message.body}")
        if media_url:
            print(f"Media URL: {media_url}")
        return message.sid

if __name__ == "__main__":
    alert_service = AlertService()
    result = alert_service.send_alert("replace_with_to_number", "This is a test alert from CovaCare!")
