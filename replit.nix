{ pkgs }: {
    deps = [
      pkgs.sqlite.bin
      pkgs.cowsay
      pkgs.nodejs-16_x
		  pkgs.nodePackages.typescript-language-server
		  pkgs.libuuid
		  pkgs.replitPackages.jest
    ];
}