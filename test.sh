#!/bin/sh

# Initial commit.
mkdir ffingerprint-test-dir && cd ffingerprint-test-dir
date > unmodified.txt && sleep 1
date > modified.txt && sleep 1
date > moved.txt && sleep 1
date > deleted.txt && sleep 1
ffingerprint commit && sleep 1

# Modify.
date > added.txt && sleep 1
date > modified.txt && sleep 1
mv moved.txt moved2.txt
rm deleted.txt

# Test.
ffingerprint status

# Clean up.
cd ..
# rm -rf ffingerprint-test-dir
