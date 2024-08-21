variable "prefix" {}
variable "fn_name" {}
variable "policy_json" {}
variable "memory" {}
variable "timeout" {}
variable "fn_env" {}

data "archive_file" "source_code" {
  type        = "zip"
  source_dir  = "../${path.root}/dist/${var.fn_name}"
  output_path = "${var.fn_name}.zip"
}

resource "aws_lambda_function" "main" {
  function_name    = "${var.prefix}-${var.fn_name}"
  role             = aws_iam_role.execution_role.arn
  filename         = data.archive_file.source_code.output_path
  source_code_hash = data.archive_file.source_code.output_sha256
  handler          = "index.handler"
  timeout          = var.timeout
  memory_size      = var.memory
  architectures    = ["arm64"]
  runtime          = "nodejs20.x"
  environment {
    variables = var.fn_env
  }
  logging_config {
    log_group             = aws_cloudwatch_log_group.logs.arn
    log_format            = "JSON"
    application_log_level = "TRACE"
    system_log_level      = "INFO"
  }
}

output "fn_name" {
  value = aws_lambda_function.main.function_name
}

output "fn_arn" {
  value = aws_lambda_function.main.arn
}

output "fn_invoke_arn" {
  value = aws_lambda_function.main.invoke_arn
}