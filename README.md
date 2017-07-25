# USI Lambda

This is an experiment that uses AWS Lambda functions to experiment with using the USI API.

It was created in the USI Hackathon on 20th July 2017.

This project allows a new USI submisison to be created via email. The idea being that a submitter could provide JSON files as attachment containing samples, studies etc. to enable a one step submission.

Currently the code does not process attachments so cannot get further than the initial submission creation.

## Getting Started

The code is deployed on AWS to deploy it elsewhere you will need to set up AWS keys. To create a submission send an email to:

`
usi-new-submittion@skillsmapper.site
`

Anything you put in the subject line will be treated as the team name.

You will then get a reply providing a link to a UI where you can view the newly created submission.

## Authors

* **Daniel Vaughan** - *dvaughan@ebi.ac.uk*
