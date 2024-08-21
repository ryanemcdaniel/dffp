locals {
  #   fn_name = replace(var.fn_name, "_", "-")
  fn_name = var.fn_name
}

resource "aws_lambda_function" "main" {
  function_name = "${var.prefix}-${local.fn_name}"
  role          = aws_iam_role.execution_role.arn

  filename         = data.archive_file.source_code.output_path
  source_code_hash = data.archive_file.source_code.output_sha256
  handler          = "index.handler"

  architectures = ["arm64"]
  runtime       = "nodejs20.x"
  memory_size   = var.memory
  timeout       = var.timeout

  environment {
    variables = var.fn_env
  }
  logging_config {
    log_format = "Text"
    #     application_log_level = "ERROR"
    #     system_log_level      = "INFO"
  }
}