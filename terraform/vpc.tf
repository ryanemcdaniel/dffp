data "aws_ami" "fck_nat" {
    filter {
        name   = "name"
        values = ["fck-nat-al2023-*"]
    }

    filter {
        name   = "architecture"
        values = ["arm64"]
    }

    owners      = ["568608671756"]
    most_recent = true
}

data "aws_subnet" "public" {

}

resource "aws_network_interface" "fck-nat-if" {
    subnet_id       = aws_subnet.subnet_public.id
    security_groups = [aws_default_security_group.default_security_group.id]

    source_dest_check = false
}

resource "aws_instance" "fck-nat" {
    ami           = data.aws_ami.fck_nat.id
    instance_type = "t4g.nano"

    network_interface {
        network_interface_id = aws_network_interface.fck-nat-if.id
        device_index         = 0
    }
}