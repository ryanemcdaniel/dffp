locals {
  lambda_env = {
    DFFP_DDB_PLAYER  = ""
    DFFP_DDB_DISCORD = ""
    DFFP_DDB_CLAN    = ""
    DFFP_DDB_CLAN    = ""
  }
}

module "lambda_poll" {
  source = "./modules/lambda"
  prefix      = local.prefix
  fn_name     = "poll_coc"
  policy_json = data.aws_iam_policy_document.lambda_poll.json
  memory      = 128
  timeout     = 300
  fn_env      = local.lambda_env
}
data "aws_iam_policy_document" "lambda_poll" {
  statement {
    effect = "Allow"
    actions = ["*"]
    resources = ["*"]
  }
}
