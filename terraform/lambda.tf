locals {
  discord_in = "poll_clan"
}
data "archive_file" "discord_in" {
  type        = "zip"
  source_dir  = "../${path.module}/dist/${local.discord_in}"
  output_path = "${local.discord_in}.zip"
}
resource "aws_lambda_function" "discord_in" {
  function_name    = "${local.prefix}-${local.discord_in}"
  role             = aws_iam_role.discord_in.arn
  filename         = data.archive_file.discord_in.output_path
  source_code_hash = data.archive_file.discord_in.output_sha256
  handler          = "index.handler"
  memory_size      = 128
  architectures    = ["arm64"]
  runtime          = "nodejs20.x"
}
resource "aws_iam_role" "discord_in" {
  assume_role_policy = data.aws_iam_policy_document.discord_in.json
}
data "aws_iam_policy_document" "discord_in" {
  statement {
    effect    = "Allow"
    actions   = ["*"]
    resources = ["*"]
  }
}