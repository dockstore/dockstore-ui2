#! /bin/bash

# Set the exit code of a pipeline to that of the rightmost command
# to exit with a non-zero status, or zero if all commands of the pipeline exit
set -o pipefail
# cause a bash script to exit immediately when a command fails
set -e
# cause the bash shell to treat unset variables as an error and exit immediately
set -u
# echo each line of the script to stdout so we can see what is happening
set -o xtrace
#to turn off echo do 'set +o xtrace'

get_OS_type()
{
  unameOut="$(uname -s)"
  case "${unameOut}" in
      Linux*)     machine=Linux;;
      Darwin*)    machine=Mac;;
      CYGWIN*)    machine=Cygwin;;
      MINGW*)     machine=MinGw;;
      *)          machine="UNKNOWN:${unameOut}"
  esac
  echo "Identified OS as ${machine}"
}

install_git_secrets_from_source()
{
  echo "Installing git secrets from source"
  wget --no-verbose -O git-secrets-1.3.0.tar.gz https://github.com/awslabs/git-secrets/archive/1.3.0.tar.gz
  tar -zxf git-secrets-1.3.0.tar.gz
  cd git-secrets-1.3.0
  sudo make install
}

install_git_secrets_with_Brew()
{
  echo "Installing git secrets with Brew"
  # install git secrets using brew
  brew install git-secrets
}

# if git secrets is not installed
if ! which git-secrets &>/dev/null
then
  echo "git secrets is not installed"
  get_OS_type
  # if the OS is Mac
  if [[ ${machine} == "Mac" ]]
  then
    # if brew is installed
    if which brew &>/dev/null
    then
      install_git_secrets_with_Brew
    else
      echo "Brew not present so cannot install git secrets"
    fi
  elif [[ ${machine} == "Linux" ]]
  then
    install_git_secrets_from_source
  else
    echo "Unsupported OS for git secrets install"
  fi
else
  echo "git secrets is already installed"
fi

# if git secrets is now installed
if which git-secrets &>/dev/null
then
  # setup the AWS specific configuration variables
  # and custom patterns
  git secrets --register-aws
  git secrets --add "[a-fA-F0-9]{30,}"
fi


