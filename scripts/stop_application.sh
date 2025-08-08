#!/bin/bash
pm2 delete all || true
sudo pkill -f node || true