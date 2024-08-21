locals {
  lambda_env = {
    DFFP_DDB_PLAYER  = ""
    DFFP_DDB_DISCORD = ""
    DFFP_DDB_CLAN    = ""
    DFFP_DDB_CLAN    = ""
    NODE_OPTIONS     = "--enable-source-maps"
  }
}

#
#
#
module "lambda_api_discord" {
  source             = "./modules/lambda"
  prefix             = local.prefix
  fn_name            = "api_discord"
  custom_policy_json = data.aws_iam_policy_document.lambda_api_discord.json
  memory             = 128
  timeout            = 300
  fn_env             = local.lambda_env
}

data "aws_iam_policy_document" "lambda_api_discord" {
  statement {
    effect = "Allow"
    actions = [
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]
    resources = ["arn:aws:logs:*:*:*"]
  }
  statement {
    effect    = "Allow"
    actions   = ["*"]
    resources = ["*"]
  }
}

resource "aws_lambda_permission" "api_discord_get" {
  function_name = module.lambda_api_discord.fn_name
  action        = "lambda:InvokeFunction"
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:${var.aws_region}:${data.aws_caller_identity.current.account_id}:${aws_api_gateway_rest_api.api_discord.id}/*/${aws_api_gateway_method.api_discord_get.http_method}${aws_api_gateway_resource.api_discord.path}"
}

resource "aws_lambda_permission" "api_discord_post" {
  function_name = module.lambda_api_discord.fn_name
  action        = "lambda:InvokeFunction"
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:${var.aws_region}:${data.aws_caller_identity.current.account_id}:${aws_api_gateway_rest_api.api_discord.id}/*/${aws_api_gateway_method.api_discord_post.http_method}${aws_api_gateway_resource.api_discord.path}"
}

#
#
#
module "lambda_poll_coc" {
  source             = "./modules/lambda"
  prefix             = local.prefix
  fn_name            = "poll_coc"
  custom_policy_json = data.aws_iam_policy_document.lambda_poll_coc.json
  memory             = 128
  timeout            = 300
  fn_env             = local.lambda_env
}

data "aws_iam_policy_document" "lambda_poll_coc" {
  statement {
    effect = "Allow"
    actions = [
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]
    resources = ["arn:aws:logs:*:*:*"]
  }
  statement {
    effect    = "Allow"
    actions   = ["*"]
    resources = ["*"]
  }
}
