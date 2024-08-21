variable "aws_region" {}
variable "env" {}
variable "service" {}
variable "coc_ssm_user" {}
variable "coc_ssm_password" {}
variable "discord_url" {}
variable "discord_ssm_token" {}

data "aws_caller_identity" "current" {}

output "stuff" {
  value = data.aws_caller_identity.current.account_id
}