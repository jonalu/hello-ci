#! /bin/bash
TAG=$1
DOCKER_PRIVATE_REPO=$2
IMAGE_NAME=$3

# Create new Elastic Beanstalk version
EB_BUCKET=$4
DOCKERRUN_FILE=$TAG-Dockerrun.aws.json
AWS_REGION=eu-west-1

sed -e "s/<TAG>/$TAG/" \
  -e "s/<DOCKER_PRIVATE_REPO>/$DOCKER_PRIVATE_REPO/" \
  -e "s/<IMAGE_NAME>/$IMAGE_NAME/" \
  < Dockerrun.aws.template.json \
  > $DOCKERRUN_FILE

aws s3 cp $DOCKERRUN_FILE s3://$EB_BUCKET/$DOCKERRUN_FILE --region $AWS_REGION

aws elasticbeanstalk create-application-version --application-name hello \
  --version-label $TAG --source-bundle S3Bucket=$EB_BUCKET,S3Key=$DOCKERRUN_FILE \
  --region $AWS_REGION

# Update Elastic Beanstalk environment to new version
aws elasticbeanstalk update-environment --environment-name hello-env \
    --version-label $TAG \
    --region $AWS_REGION
