#! /bin/bash
TAG=$1
DOCKER_PRIVATE_REPO=$2
IMAGE_NAME=$3
EB_BUCKET=$4
AWS_REGION=$5
AWS_APP_NAME=$6
AWS_APP_ENV=$7
DOCKERRUN_FILE=$TAG-Dockerrun.aws.json

sed -e "s/<TAG>/$TAG/" \
  -e "s/<DOCKER_PRIVATE_REPO>/$DOCKER_PRIVATE_REPO/" \
  -e "s/<IMAGE_NAME>/$IMAGE_NAME/" \
  < Dockerrun.aws.template.json > $DOCKERRUN_FILE

aws s3 cp $DOCKERRUN_FILE s3://$EB_BUCKET/$DOCKERRUN_FILE --region $AWS_REGION

aws elasticbeanstalk create-application-version --application-name $AWS_APP_NAME \
  --version-label $TAG --source-bundle S3Bucket=$EB_BUCKET,S3Key=$DOCKERRUN_FILE \
  --region $AWS_REGION

# Update Elastic Beanstalk environment to new version
aws elasticbeanstalk update-environment --environment-name $AWS_APP_ENV \
    --version-label $TAG \
    --region $AWS_REGION
