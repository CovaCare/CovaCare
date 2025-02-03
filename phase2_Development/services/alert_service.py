from twilio.rest import Client

class AlertService:
    def __init__(self, account_sid, auth_token, from_number):
        self.client = Client(account_sid, auth_token)
        self.from_number = from_number
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
    account_sid = ''
    auth_token = ''
    from_number = ''

    alert_service = AlertService(account_sid, auth_token, from_number)
    result = alert_service.send_alert("replace with to number", "This is a test alert! from CovaCare!")
    print(result)
