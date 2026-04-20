import os

# It's essential to ensure that we do not expose tokens in the code.
# Retrieve the token from the environment variables instead.
# Token should be set in an environment variable "MY_SECRET_TOKEN"
MY_SECRET_TOKEN = os.getenv('MY_SECRET_TOKEN')

# Example usage
if MY_SECRET_TOKEN is None:
    raise ValueError('Secret token is not set in environment variables')

# Rest of your bot implementation...