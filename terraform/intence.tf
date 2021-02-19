resource "aws_instance" "instance" {
  ami             = var.aws_ami
  instance_type   = var.aws_instance_type
  key_name        = var.aws_key_name
  security_groups = [aws_security_group.allowed_traffic.name]
  tags = {
    Name = var.aws_instance_name
  }
}