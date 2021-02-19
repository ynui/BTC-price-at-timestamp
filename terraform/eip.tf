resource "aws_eip" "lb" {
  instance = aws_instance.instance.id
  vpc      = true
}