# recipe_box Back-end

A recipe sharing app built in Django and Angular. This will be similar to the version I built in Flask [here](https://github.com/Hall-Erik/recipe_box).

The Angular frontend can be found [here](https://github.com/Hall-Erik/recipebox-frontend)

## Development server

Download and run `python manage.py migrate` to build a SQLite database.

Download the dependencies with `pip install -r requirements.txt`.

You'll need an AWS account and S3 bucket set up for image uploads.
Then set some environment variables for `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` and `S3_BUCKET`.

You will need a Sendgrid account to get the email backend working. Follow directons on their website to get an api key for sending mail via SMTP and set environment variables for `SENDGRID_USER` and `SENDGRID_PASS`.

Run `python manage.py runserver` for a dev server. The app will automatically reload if you change any of the source files.

## Running unit tests

Run `python manage.py test` to execute the tests.