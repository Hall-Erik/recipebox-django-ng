# recipe_box

[![Build Status](https://travis-ci.org/Hall-Erik/recipebox-django-ng.svg?branch=master)](https://travis-ci.org/Hall-Erik/recipebox-django-ng)
[![Coverage Status](https://coveralls.io/repos/github/Hall-Erik/recipebox-django-ng/badge.svg?branch=master)](https://coveralls.io/github/Hall-Erik/recipebox-django-ng?branch=master)

A recipe sharing app built in Django and Angular. This is similar to a project I built in Flask [here](https://github.com/Hall-Erik/recipe_box).

This project is live on Heroku [here](https://drf-recipebox.herokuapp.com)

## Development server

### Backend

Open a terminal in the project root and run `python manage.py migrate` to build a SQLite database.

Download the dependencies with `pip install -r requirements.txt`.

You'll need an AWS account and S3 bucket set up for image uploads.
Then set some environment variables for `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` and `S3_BUCKET`.

You will need a Sendgrid account to get the email backend working. Follow directons on their website to get an api key for sending mail via SMTP and set environment variables for `SENDGRID_USER` and `SENDGRID_PASS`.

Run `python manage.py runserver` for a dev server. The app will automatically reload if you change any of the source files.

### Frontend

Open a terminal in the ng_frontend directory and run `npm install`

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Docker Compose

Alternatively, you could just run the project in Docker.

Open a terminal in the project root and run `docker-compose build` to set up your containers.

Run `docker-compose up` to run the images.

Go to `http://localhost:1337/` in your browser.

## Running unit tests

Run `python manage.py test` to execute the tests.

## Building the Frontend

The build process uses a Python script called `ng2django`.  So, be sure to use an environment where you have installed dependencies with `pip install -r requirements.txt`.

Then you can `cd` into the `ng_frontend` directory.  Run `npm run build`.