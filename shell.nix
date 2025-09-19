{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  name = "Functions Api";

  buildInputs = [
    pkgs.dotnet-sdk_8
    pkgs.dotnet-sdk_9
    pkgs.dotnet-runtime_9
    pkgs.dotnet-runtime_8
    pkgs.omnisharp-roslyn

    pkgs.azure-cli
    pkgs.azure-functions-core-tools

    pkgs.fish

    pkgs.nodejs
  ];
}
