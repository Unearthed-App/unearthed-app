#!/bin/bash

read -p "Are you sure you want to apply migrations to PROD? Type 'y' to continue, 'n' to cancel: " answer
if [ "$answer" != "y" ]; then
  echo "Migration canceled."
  exit 1
fi

# Run the next dev command
npx drizzle-kit migrate
