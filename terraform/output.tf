output "coc_static_ip" {
    value = ""
}
output "discord_post_url" {
    value = ""
}

output "stuff" {
    value = data.aws_caller_identity.current.account_id
}

data "aws_caller_identity" "current" {}