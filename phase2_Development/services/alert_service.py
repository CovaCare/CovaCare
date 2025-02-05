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
        self.alert_sent = False 

    def send_alert(self, to_number, message):
        if self.alert_sent:
            return {"success": False, "message": "Alert has already been sent."}
        
        message = self.client.messages.create(
            body=message,
            from_=self.from_number,
            to=to_number
        )
        self.alert_sent = True
        print("Message Sent!")
        print(f"Message sent from: {self.from_number} to: {to_number}")
        print(f"Message content: {message.body}")
        return message.sid

if __name__ == "__main__":
    alert_service = AlertService()
    result = alert_service.send_alert("13062096718", "This is a test alert! from CovaCare!")
    print(result)
