resource "aws_cloudwatch_log_group" "logs" {
  name              = "/aws/lambda/${var.prefix}-${var.fn_name}"
  retention_in_days = 7
}