variable "prefix" {}
variable "fn_name" {}
variable "custom_policy_json" {}
variable "memory" {}
variable "timeout" {}
variable "fn_env" {}

data "archive_file" "source_code" {
  type        = "zip"
  source_dir  = "../${path.root}/dist/${var.fn_name}"
  output_path = "${path.root}/.terraform/${var.fn_name}.zip"
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