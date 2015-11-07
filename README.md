# ZOB Angels Volunteer Planning

## LICENSE

This software is licensed under the MIT License. See LICENSE file for more details

## Getting started

You will need a *Facebook App* (https://developers.facebook.com)

You will need a Parse App (https://parse.com)

You will need a key with the *Google Developer Console* (https://console.developers.google.com/flows/enableapi?apiid=maps_backend&keyType=CLIENT_SIDE&reusekey=true)

If you want to use AWS S3 for hosting, you will also need an account with *Amazon AWS* (https://aws.amazon.com)

Clone the project with `git clone https://github.com/SpruceHillio/ZOBAngels.git`

Create a `config.json` file on the project root with the following content:
```
{
  "meta" : {
    "title" : "Your meta information title",
    "description" : "Your meta information description"
  },
  "hosting" : {
    "base" : "The base URL where you want to host including a trailing slash"
  },
  "facebook" : {
    "appId" : FACEBOOK_APP_ID
  },
  "parse" : {
    "applicationId" : "PARSE_APPLICATION_ID",
    "javaScriptKey" : "PARSE_JAVSCRIPT_KEY"
  },
  "google" : {
    "applicationKey" : "GOOGLE_APPLICATION_KEY"
  },
  "aws" : {
    "deploy" : {
      "bucket" : "AWS_S3_BUCKET"
    }
  }
}```
 
Create a `deploy-keys.json` file with the following content (if you want to use AWS S3):
```
{
  "AWSAccessKeyId": "AWS_ACCESS_KEY_ID",
  "AWSSecretKey": "AWS_SECRET_KEY",
  "AWSRegion":  "AWS_REGION"
}
```

Create a Parse config value for `zobangels_type_angels` of type *Array* and add the Facebook IDs of all users that should see the special *angel* section of each day.

And that's it - you're good to go.