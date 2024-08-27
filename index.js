const fs = require("fs");
const path = require("path");
const { NodeIO } = require("@gltf-transform/core");
const { vec3 } = require("gl-matrix");

const inputPath = "./input";
const outputPath = "./output";
const scaleFactor = 0.1; // 50%縮小

const applyGlobalScale = (root, scaleFactor) => {
  const rootNode = root.listNodes()[0];
  const scale = rootNode.getScale();
  vec3.scale(scale, scale, scaleFactor);
  rootNode.setScale(scale);
};

const scaleModelsInDirectory = async (directory, outputDirectory) => {
  const io = new NodeIO();

  fs.readdirSync(directory).forEach(async (file) => {
    const filePath = path.join(directory, file);
    const outputFullPath = path.join(outputDirectory, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      // ディレクトリの場合、再帰的に処理を続ける
      if (!fs.existsSync(outputFullPath)) {
        fs.mkdirSync(outputFullPath, { recursive: true });
      }
      scaleModelsInDirectory(filePath, outputFullPath);
    } else if (path.extname(file) === ".glb") {
      console.log(`Processing: ${filePath}`);

      const document = await io.read(filePath);
      const root = document.getRoot();

      applyGlobalScale(root, scaleFactor);

      const outputFilePath = path.join(outputDirectory, file);
      io.write(outputFilePath, document);
      console.log(`Saved: ${outputFilePath}`);
    }
  });
};

scaleModelsInDirectory(inputPath, outputPath);
