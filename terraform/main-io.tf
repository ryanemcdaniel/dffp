variable "aws_region" {}
variable "env" {}
variable "service" {}
variable "coc_ssm_user" {}
variable "coc_ssm_password" {}
variable "discord_url" {}
variable "discord_ssm_token" {}

data "aws_organizations_organization" "current" {}
data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

output "account_id" {
  value = data.aws_caller_identity.current.account_id
}

output "url_discord_interactions" {
  value = "${aws_api_gateway_deployment.api_discord.invoke_url}${aws_api_gateway_stage.api_discord.stage_name}${aws_api_gateway_resource.api_discord.path}"
}
