import requests

def send_sms(phone_number, message):
    url = 'http://localhost:9090/text' # TextBelt server URL
    payload = {
        'number': phone_number,
        'message': message
    }
    response = requests.post(url, data=payload)
    return response.json()

if __name__ == '__main__':
    phone_number = '3062096718'  
    message = 'Hello! This is a test message using TextBelt.'
    result = send_sms(phone_number, message)
    print(result)
