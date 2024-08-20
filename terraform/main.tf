terraform {
  required_version = "1.9.1"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.57.0"
    }
  }
  backend "s3" {}
}

provider "aws" {
  region = var.aws_region
}


locals {
  prefix = "${var.env}-${var.reg}-${var.service}"
}

