resource "aws_cloudwatch_event_bus" "bus" {
  name = "${local.prefix}-bus"
}
