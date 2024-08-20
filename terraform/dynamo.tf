resource "aws_dynamodb_table" "player_discord" {
    name      = "${local.prefix}-war"
    hash_key  = "clan_id"
    range_key = "start"
}

resource "aws_dynamodb_table" "player_snapshot" {
    name      = "${local.prefix}-player-snapshot"
    hash_key  = "player_id"
    range_key = "timestamp"
}

resource "aws_dynamodb_table" "war_snapshot" {
    name      = "${local.prefix}-war"
    hash_key  = "clan_id"
    range_key = "start"
}