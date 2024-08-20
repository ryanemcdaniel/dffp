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
  default_tags {
    tags = {
      environment = var.env
    }
  }
}

variable "aws_region" {}

variable "env" {}
variable "reg" {}
variable "service" {}

variable "coc_ssm_user" {}
variable "coc_ssm_password" {}
variable "discord_url" {}
variable "discord_ssm_token" {}

data "aws_caller_identity" "current" {}


locals {
  prefix = "${var.env}-${var.reg}-${var.service}"
}

output "stuff" {
  value = data.aws_caller_identity.current.account_id
}

