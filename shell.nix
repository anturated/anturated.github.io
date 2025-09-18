{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  name = "Functions Api";

  buildInputs = [
    # pkgs.dotnetCorePackages.dotnet_9.sdk
    # pkgs.dotnetCorePackages.dotnet_8.sdk
    pkgs.dotnet-sdk_8
    pkgs.dotnet-sdk_9
    pkgs.dotnetCorePackages.runtime_9_0-bin
    pkgs.omnisharp-roslyn
    pkgs.pgadmin
    pkgs.fish
    pkgs.python312Packages.psycopg2
    pkgs.postgresql
    pkgs.zlib
    pkgs.azure-cli
    pkgs.azure-functions-core-tools
  ];
}
