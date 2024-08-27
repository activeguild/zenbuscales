const fs = require('fs');
const path = require('path');
const { NodeIO } = require('@gltf-transform/core');
const { vec3 } = require('gl-matrix');

const directoryPath = './before';
const scaleFactor = 0.5;  // 50%縮小

const applyGlobalScale = (root, scaleFactor) => {
    const rootNode = root.listNodes()[0];
    const scale = rootNode.getScale();
    vec3.scale(scale, scale, scaleFactor);
    rootNode.setScale(scale);
};

const scaleModelsInDirectory = async (directory, scaleFactor) => {
    const io = new NodeIO();

    fs.readdirSync(directory).forEach(async file => {
        if (path.extname(file) === '.glb') {
            const filePath = path.join(directory, file);
            console.log(`Processing: ${filePath}`);

            const document = await io.read(filePath);
            const root = document.getRoot();

            applyGlobalScale(root, scaleFactor);

            const outputFilePath = path.join(directory, 'scaled_' + file);
            io.write(outputFilePath, document);
            console.log(`Saved: ${outputFilePath}`);
        }
    });
};

scaleModelsInDirectory(directoryPath, scaleFactor);
