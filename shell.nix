{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  name = "Functions Api";

  buildInputs = [
    pkgs.dotnet-sdk_8
    pkgs.dotnet-sdk_9
    pkgs.dotnetCorePackages.runtime_9_0-bin
    pkgs.omnisharp-roslyn

    pkgs.azure-cli
    pkgs.azure-functions-core-tools

    pkgs.fish

    pkgs.nodejs
  ];
}
