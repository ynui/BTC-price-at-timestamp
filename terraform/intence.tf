resource "aws_instance" "instance" {
  ami             = var.aws_ami
  instance_type   = var.aws_instance_type
  key_name        = var.aws_key_name
  security_groups = [aws_security_group.allowed_traffic.name]
  tags = {
    Name = var.aws_instance_name
  }

  provisioner "file" {
    source      = "../all"
    destination = "./BTC-TS"
    connection {
      user        = "ubuntu"
      host        = self.public_ip
      type        = "ssh"
      private_key = file("./ssh.pem")
    }
  }
  provisioner "file" {
    source      = "./bash/build.sh"
    destination = "./build.sh"
    connection {
      user        = "ubuntu"
      host        = self.public_ip
      type        = "ssh"
      private_key = file("./ssh.pem")
    }
  }
  provisioner "file" {
    source      = "./bash/run.sh"
    destination = "./run.sh"
    connection {
      user        = "ubuntu"
      host        = self.public_ip
      type        = "ssh"
      private_key = file("./ssh.pem")
    }
  }

  provisioner "remote-exec" {
    connection {
      user        = "ubuntu"
      host        = self.public_ip
      type        = "ssh"
      private_key = file("./ssh.pem")
    }

    inline = [
      "/bin/bash ./build.sh",
      # "/bin/bash ./run.sh",
    ]
  }
}
