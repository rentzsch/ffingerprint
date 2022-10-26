# ffingerprint

**ffingerprint** is a simple command-line tool for tracking file system content changes (file additions, modifications, and deletions).

It does so by writing out a simple `ffingerprint.json` file containing file paths and their SHA-1 hashes.

## Installation

```sh
$ npm install --global ffingerprint
```

## Usage

```sh
$ cd path/to/some/dir
$ ffingerprint commit # Create or Update ffingerprint.json based on cwd
# ... time passes ...
$ ffingerprint status
DEL deleted.txt
MOD modified.txt
MOV moved.txt => moved2.txt
ADD added.txt
```
