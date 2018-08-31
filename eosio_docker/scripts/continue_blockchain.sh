#!/usr/bin/env bash
set -o errexit

# this file is used to continue the stopped blockchain

echo "=== start blockchain with  ==="

# set PATH
PATH="$PATH:/opt/eosio/bin"

set -m

# start nodeos ( local node of blockchain )
# run it in a background job such that docker run could continue
nodeos -e -p eosio -d /mnt/dev/data \
  --config-dir /mnt/dev/config \
  --hard-replay \
  --http-validate-host=false \
  --plugin eosio::producer_plugin \
  --plugin eosio::history_plugin \
  --plugin eosio::chain_api_plugin \
  --plugin eosio::history_api_plugin \
  --plugin eosio::http_plugin \
  --plugin eosio::producer_heartbeat_plugin \
  --http-server-address=0.0.0.0:8888 \
  --access-control-allow-origin=* \
  --contracts-console \
  --heartbeat-signature-provider EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV:Key=5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3 \
  --heartbeat-period 30 \
  --heartbeat-contract heartbeatacc \
  --verbose-http-errors

# `--hard-replay` option is needed
# because the docker stop signal is not being passed to nodeos process directly
# as we run the init_blockchain.sh as PID 1.
