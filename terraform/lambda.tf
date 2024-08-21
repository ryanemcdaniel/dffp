locals {
  lambda_env = {
    DFFP_DDB_PLAYER  = ""
    DFFP_DDB_DISCORD = ""
    DFFP_DDB_CLAN    = ""
    DFFP_DDB_CLAN    = ""
  }
}


module "lambda_api_discord" {
  source      = "./modules/lambda"
  prefix      = local.prefix
  fn_name     = "api_discord"
  policy_json = data.aws_iam_policy_document.lambda_api_discord.json
  memory      = 128
  timeout     = 300
  fn_env      = local.lambda_env
}

data "aws_iam_policy_document" "lambda_api_discord" {
  statement {
    effect    = "Allow"
    actions   = ["*"]
    resources = ["*"]
  }
}

resource "aws_lambda_permission" "api_discord" {
  function_name = module.lambda_api_discord.fn_name
  action        = "lambda:InvokeFunction"
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:${var.aws_region}:${data.aws_caller_identity.current.account_id}:${aws_api_gateway_rest_api.api_discord.id}/*/${aws_api_gateway_method.api_discord.http_method}${aws_api_gateway_resource.api_discord.path}"
}


module "lambda_poll_coc" {
  source      = "./modules/lambda"
  prefix      = local.prefix
  fn_name     = "poll_coc"
  policy_json = data.aws_iam_policy_document.lambda_poll_coc.json
  memory      = 128
  timeout     = 300
  fn_env      = local.lambda_env
}

data "aws_iam_policy_document" "lambda_poll_coc" {
  statement {
    effect    = "Allow"
    actions   = ["*"]
    resources = ["*"]
  }
}
