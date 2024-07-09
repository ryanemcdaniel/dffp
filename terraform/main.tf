variable "aws_region" {}
variable "env" {}
variable "reg" {}
variable "service" {}
variable "coc_url" {}
variable "coc_token" {}
variable "discord_url" {}
variable "discord_token" {}

output "coc_static_ip" {
  value = ""
}
output "discord_post_url" {
  value = ""
}

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

  }
}

locals {
  prefix = "${var.env}-${var.reg}-${var.service}"
}