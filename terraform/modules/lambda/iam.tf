resource "aws_iam_policy" "execution_policy" {
  name   = "${var.prefix}-${var.fn_name}-execution-policy"
  policy = var.custom_policy_json
}

data "aws_iam_policy_document" "execution_role_policy" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "execution_role" {
  name               = "${var.prefix}-${var.fn_name}-execution-role"
  assume_role_policy = data.aws_iam_policy_document.execution_role_policy.json
}

resource "aws_iam_role_policy_attachment" "discord_in" {
  policy_arn = aws_iam_policy.execution_policy.arn
  role       = aws_iam_role.execution_role.name
}