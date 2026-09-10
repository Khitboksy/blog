{
  description = "Astro + TypeScript blog devshell";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-26.05";
    flake-parts.url = "github:hercules-ci/flake-parts";
  };

  outputs =
    inputs@{ flake-parts, ... }:
    flake-parts.lib.mkFlake { inherit inputs; } {
      systems = [ "x86_64-linux" ];

      perSystem =
        { pkgs, ... }:
        {
          devShells.default = pkgs.mkShell {
            name = "blog";
            packages = with pkgs; [
              bun
              nodejs_22
              typescript-language-server
              astro-language-server
              prettierd
              marksman
              markdownlint-cli2
            ];

            shellHook = ''
              echo "blog devshell"
              echo "  bun:  $(bun --version)"
              echo "  node: $(node --version)"
              echo "bun run dev : server"

            '';
          };
        };
    };
}
