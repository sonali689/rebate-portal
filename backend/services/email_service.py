import smtplib
import random
import string
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from config import settings

class EmailService:
    def __init__(self):
        self.smtp_server = settings.SMTP_SERVER
        self.smtp_port   = settings.SMTP_PORT
        self.username    = settings.SMTP_USERNAME
        self.password    = settings.SMTP_PASSWORD
        self.from_email  = settings.FROM_EMAIL or settings.SMTP_USERNAME

    def generate_otp(self) -> str:
        return ''.join(random.choices(string.digits, k=6))

    def send_otp_email(
        self,
        to_email: str,
        otp: str,
        purpose: str = "login"   # <-- new parameter
    ) -> bool:
        """
        Send an OTP email. 
        `purpose` can be "login" or "registration" to customize subject/body.
        """
        try:
            if not self.username or not self.password:
                print(f"🔐 OTP for {to_email}: {otp}")
                print("📧 Email service not configured. OTP printed to console.")
                return True

            # Choose subject based on purpose
            subject = (
                "Your Mess Rebate System Registration OTP"
                if purpose == "registration"
                else "Your Mess Rebate System Login OTP"
            )

            # Compose message
            msg = MIMEMultipart()
            msg['From']    = self.from_email
            msg['To']      = to_email
            msg['Subject'] = subject

            body = (
                f"Your OTP for Mess Rebate System {purpose} is: {otp}\n\n"
                f"This OTP will expire in {settings.OTP_EXPIRE_MINUTES} minutes.\n\n"
                "If you didn't request this OTP, please ignore this email."
            )
            msg.attach(MIMEText(body, 'plain'))

            # Send via SMTP
            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            server.starttls()
            server.login(self.username, self.password)
            server.sendmail(self.from_email, to_email, msg.as_string())
            server.quit()

            return True

        except Exception as e:
            print(f"❌ Failed to send email: {e}")
            print(f"🔐 OTP for {to_email}: {otp}")
            return True

# Single, shared instance
email_service = EmailService()

def send_otp_email(
    to_email: str,
    otp: str,
    purpose: str = "login"   # <-- ensure module‑level signature matches
) -> bool:
    """Convenience wrapper for the shared EmailService."""
    return email_service.send_otp_email(to_email, otp, purpose)
