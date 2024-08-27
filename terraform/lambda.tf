locals {
  lambda_env = {
    LAMBDA_ENV    = var.env
    DDB_TRACKING  = aws_dynamodb_table.tracking.name
    DDB_SNAPSHOTS = aws_dynamodb_table.snapshots.name
  }
}

#
# api-discord
#
module "lambda_api_discord" {
  source             = "./modules/lambda"
  acc_id             = local.acc_id
  prefix             = local.prefix
  fn_name            = "api_discord"
  custom_policy_json = data.aws_iam_policy_document.lambda_api_discord.json
  memory             = 256
  timeout            = 300
  fn_env             = merge(local.lambda_env, {
    SQS_APP_DISCORD = module.lambda_app_discord.fn_sqs_url
  })
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
# app-discord
#
module "lambda_app_discord" {
  source             = "./modules/lambda"
  acc_id             = local.acc_id
  prefix             = local.prefix
  fn_name            = "app_discord"
  custom_policy_json = data.aws_iam_policy_document.lambda_app_discord.json
  memory             = 512
  timeout            = 300
  fn_env             = local.lambda_env
  sqs                = true
  sqs_source_arns    = [module.lambda_api_discord.fn_arn]
}

data "aws_iam_policy_document" "lambda_app_discord" {
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

#
# app-discord-deploy
#
module "lambda_app_discord_deploy" {
  source             = "./modules/lambda"
  acc_id             = local.acc_id
  prefix             = local.prefix
  fn_name            = "app_discord_deploy"
  custom_policy_json = data.aws_iam_policy_document.lambda_app_discord_deploy.json
  memory             = 512
  timeout            = 300
  fn_env             = local.lambda_env
}

data "aws_iam_policy_document" "lambda_app_discord_deploy" {
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

resource "aws_lambda_invocation" "lambda_app_discord_deploy" {
  function_name = module.lambda_app_discord_deploy.fn_name
  input         = jsonencode({})
  triggers = {
    redeployment = jsonencode([
      module.lambda_app_discord_deploy.fn_src_hash
    ])
  }
}

#
# poll-coc
#
module "lambda_poll_coc" {
  source             = "./modules/lambda"
  acc_id             = local.acc_id
  prefix             = local.prefix
  fn_name            = "poll_coc"
  custom_policy_json = data.aws_iam_policy_document.lambda_poll_coc.json
  memory             = 256
  timeout            = 300
  fn_env             = local.lambda_env
  sqs                = true
  sqs_source_arns    = [module.lambda_scheduler.fn_arn]
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

#
# scheduler
#
module "lambda_scheduler" {
  source             = "./modules/lambda"
  acc_id             = local.acc_id
  prefix             = local.prefix
  fn_name            = "scheduler"
  custom_policy_json = data.aws_iam_policy_document.lambda_scheduler.json
  memory             = 256
  timeout            = 300
  fn_env = merge(local.lambda_env, {
    SQS_POLL = module.lambda_poll_coc.fn_sqs_url
  })
}

data "aws_iam_policy_document" "lambda_scheduler" {
  statement {
    effect = "Allow"
    actions = [
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]
    resources = ["arn:aws:logs:*:*:*"]
  }
  // todo IAM security
  statement {
    effect    = "Allow"
    actions   = ["*"]
    resources = ["*"]
  }
}

