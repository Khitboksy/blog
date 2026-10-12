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
              git
              jujutsu
            ];

            shellHook = ''
              echo "blog devshell"
              echo "  bun:   $(bun --version)"
              echo "  node:  $(node --version)"
              astro_v="$(grep -m1 -oE '"astro@[0-9]+\.[0-9]+\.[0-9]+' bun.lock 2>/dev/null | cut -d@ -f2)"
              [ -n "$astro_v" ] || astro_v='?'
              echo "  astro: $astro_v"

            '';
          };
        };
    };
}
