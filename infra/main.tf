terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket       = "coderoom-tfstate-880561240867"
    key          = "infra/terraform.tfstate"
    region       = "us-west-2"
    encrypt      = true
    use_lockfile = true # S3-native state locking (Terraform >= 1.11), no DynamoDB needed
  }
}

provider "aws" {
  region = "us-west-2"
}


data "aws_ami" "amazon_linux_arm" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-*-kernel-*-arm64"]
  }

  filter {
    name   = "architecture"
    values = ["arm64"]
  }
}

resource "aws_instance" "coderroomserver" {
  ami           = data.aws_ami.amazon_linux_arm.id
  instance_type = "t4g.nano"

  tags = {
    Name = "terraform-ec2"
  }
  vpc_security_group_ids = [aws_security_group.fastapi_sg.id]
}


resource "aws_security_group" "fastapi_sg" {
  name = "fastapi-sg"

  ingress {
    from_port   = 8000
    to_port     = 8000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

}

resource "aws_security_group" "db_sg" {
  name        = "db-sg"
  description = "Allow Postgres only from the FastAPI instances"

  # Allow Postgres (5432) ONLY from resources in fastapi_sg, not the public internet.
  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.fastapi_sg.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_db_instance" "free_tier" {
  identifier     = "free-tier-db"
  engine         = "postgres" # or "mysql"
  engine_version = "16"

  # --- Credentials (required to create a new instance) ---
  db_name                     = "appdb"
  username                    = "dbadmin"
  manage_master_user_password = true # AWS stores the password in Secrets Manager (free, no hardcoding)

  # --- Free Tier eligible settings ---
  instance_class        = "db.t3.micro" # free-tier instance class
  allocated_storage     = 20            # 20 GB is the free-tier max
  max_allocated_storage = 0             # 0 = autoscaling disabled (avoid surprise charges)
  storage_type          = "gp2"
  multi_az              = false # Multi-AZ is NOT free
  publicly_accessible   = false

  vpc_security_group_ids = [aws_security_group.db_sg.id]

  backup_retention_period = 7
  skip_final_snapshot     = true  # set false for real workloads
  deletion_protection     = false # set true for real workloads

  # Disable extras that incur cost
  performance_insights_enabled = false
  monitoring_interval          = 0
}

output "db_endpoint" {
  value = aws_db_instance.free_tier.endpoint
}