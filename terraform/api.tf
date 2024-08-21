resource "aws_api_gateway_rest_api" "api_discord" {
    name = "${local.prefix}-api-discord"
    endpoint_configuration {
        types = ["REGIONAL"]
    }
}

resource "aws_api_gateway_resource" "api_discord" {
    rest_api_id = aws_api_gateway_rest_api.api_discord.id
    parent_id   = aws_api_gateway_rest_api.api_discord.root_resource_id
    path_part   = "dffp"
}

resource "aws_api_gateway_method" "aws_api_gw_method" {
    rest_api_id        = aws_api_gateway_rest_api.api_discord.id
    resource_id        = aws_api_gateway_resource.api_discord.id
    http_method        = "POST"
    authorization      = "NONE"
}

resource "aws_api_gateway_method_response" "proxy" {
    rest_api_id = aws_api_gateway_rest_api.dffp_discord.id
    resource_id = aws_api_gateway_resource.discord_root.id
    http_method = aws_api_gateway_method.discord_interaction.http_method
    status_code = "200"
    response_parameters = {
        "method.response.header.Access-Control-Allow-Headers" = true,
        "method.response.header.Access-Control-Allow-Methods" = true,
        "method.response.header.Access-Control-Allow-Origin" = true
    }
}

resource "aws_api_gateway_integration" "api_discord_post" {
    rest_api_id             = aws_api_gateway_rest_api.api_discord.id
    resource_id             = aws_api_gateway_resource.api_discord.id
    http_method             = aws_api_gateway_method.aws_api_gw_method.http_method
    integration_http_method = "POST"
    type                    = "AWS_PROXY"
    uri                     = module.lambda_api_discord.fn_invoke_arn
}

resource "aws_api_gateway_integration_response" "proxy" {
    rest_api_id         = aws_api_gateway_rest_api.dffp_discord.id
    resource_id         = aws_api_gateway_resource.discord_root.id
    http_method         = aws_api_gateway_method.discord_interaction.http_method
    status_code         = aws_api_gateway_method_response.proxy.status_code
    response_parameters = {
        "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
        "method.response.header.Access-Control-Allow-Methods" = "'GET,OPTIONS,POST,PUT'",
        "method.response.header.Access-Control-Allow-Origin"  = "'*'"
    }
}

resource "aws_api_gateway_deployment" "api_discord" {
    rest_api_id = aws_api_gateway_rest_api.api_discord.id
    triggers    = {
        redeployment = sha1(jsonencode(aws_api_gateway_rest_api.api_discord.body))
    }
    lifecycle {
        create_before_destroy = true
    }
}