import pytest
import os
import sys
from unittest.mock import patch

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__))))
from src.alert_service import AlertService

@pytest.fixture
def mock_twilio_client():
    with patch('alert_service.Client') as mock_client:
        mock_instance = mock_client.return_value
        mock_messages = mock_instance.messages
        mock_messages.create.return_value.sid = "mocked-message-sid"
        yield mock_instance

def test_send_alert_success(mock_twilio_client):
    service = AlertService()
    to_number = "+1234567890"
    message = "Test Alert"

    sid = service.send_alert(to_number, message)

    mock_twilio_client.messages.create.assert_called_once_with(
        body=message, from_=service.from_number, to=to_number
    )
    assert sid == "mocked-message-sid"

def test_send_alert_failure(mock_twilio_client):
    service = AlertService()
    to_number = "+1234567890"
    message = "Test Alert"

    mock_twilio_client.messages.create.side_effect = Exception("Twilio error")

    with pytest.raises(Exception, match="Twilio error"):
        service.send_alert(to_number, message)
