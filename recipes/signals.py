from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.dispatch import receiver
from django.template.loader import render_to_string
from django_rest_passwordreset.signals import reset_password_token_created


@receiver(reset_password_token_created)
def password_reset_token_created(
  sender, instance, reset_password_token, *args, **kwargs):
    domain = settings.DOMAIN
    context = {
        'current_user': reset_password_token.user,
        'username': reset_password_token.user.username,
        'email': reset_password_token.user.email,
        'reset_password_url': f'{domain}/reset/{reset_password_token.key}'
    }

    email_html_message = render_to_string(
      'email/user_reset_password.html', context)
    email_txt_message = render_to_string(
      'email/user_reset_password.txt', context)

    msg = EmailMultiAlternatives(
        "Password Reset for recipe_box",
        email_txt_message,
        'noreply@recipebox',
        [reset_password_token.user.email])

    msg.attach_alternative(email_html_message, 'txt/html')
    msg.send()
