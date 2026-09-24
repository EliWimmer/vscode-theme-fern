# Configuration for development environment
{ pkgs ? import <nixpkgs> {} }:

let
  # This will cause a warning - deprecated attribute
  pythonOld = pkgs.python37;

  customPkg = pkgs.stdenv.mkDerivation {
    pname = "test-package";
    version = "1.0.0";

    # This will cause an error - invalid syntax
    src = ./. break;

    buildInputs = with pkgs; [
      nodejs-18_x
      (python3.withPackages (ps: with ps; [
        requests
        pandas
        numpy
      ]))
    ];

    shellHook = ''
      export NODE_ENV="development"
      export SOME_SECRET="shhhh"

      # String interpolation
      echo "Building ${customPkg.pname} v${customPkg.version}"

      # Conditional expression
      if [ -f ".env" ]; then
        source .env
      fi
    '';
  };

in
pkgs.mkShell {
  inherit (customPkg) buildInputs;

  # Nix functions and operators
  packages = pkgs.lib.lists.flatten [
    pkgs.git
    (if pkgs.stdenv.isDarwin
     then [ pkgs.darwin.apple_sdk.frameworks.CoreServices ]
     else [ ])
  ];
}
