import { Presets, SingleBar } from "cli-progress";
import { Project, Node, InterfaceDeclaration, Type, TypeFormatFlags, SyntaxKind, ArrowFunction, DefaultClause, JSDocableNode, PropertyAssignment } from "ts-morph";

const progress = new SingleBar({
    format: "{percentage}% | {bar} | {stage} | {value}/{total}"
}, Presets.shades_classic)
progress.start(100, 0, {stage: "Loading project files"})

const project = new Project();
const sourceFile = project.addSourceFileAtPath("./node_modules/smule.js/dist/index.d.ts");
const exampleClass = sourceFile.getClassOrThrow("Smule")!;
const secondaryClass = sourceFile.getClassOrThrow("SmuleDotCom")!;
progress.setTotal(exampleClass.getProperties().length + secondaryClass.getProperties().length + 3)

let backendContent = `import { ipcMain, IpcMainInvokeEvent } from "electron";\n`
                   + `import { Smule, SmuleDotCom } from "smule.js";\n`
                   + `export function initializeIPCHandler(client: Smule, sdcClient: SmuleDotCom) {\n`
function generateInterfaceFromType(type: Type, indent: number, path: string[], isSdc = false): string {
    const indentStr = " ".repeat(indent * 4);
    let result = "{\n";

    if (isSdc) {
        if (type.getText().includes("=>")) {
            const args = type.getText().split("=>")[0].trim().replace(/Uint8Array<[^>]*>/g, "Uint8Array")
            const typ = type.getText().split("=>")[1].trim().replace(/Uint8Array<[^>]*>/g, "Uint8Array")
            const sign = type.getCallSignatures()[0]
            const params = sign.getParameters().map(p => p.getName()).join(", ")
            result = `async ${args}: Promise<${typ}> => await ipcRenderer.invoke("smuledotcom.${path.join(".")}"${params ? `, ${params}` : ""})`
            backendContent += `    ipcMain.handle("smuledotcom.${path.join(".")}", async (_event: IpcMainInvokeEvent${params ? `, ${params}` : ""}) => {const res = await sdcClient.${path.join(".")}(${params}); return res;});\n`
            return result
        }
    }

    const properties = type.getProperties();
    for (const property of properties) {
        const propName = property.getName();
        const propType = property.getTypeAtLocation(exampleClass);
        if (!propType.getText().includes("=>")) continue
        const declarations = property.getDeclarations();
        const jsDoc = declarations[0]?.getLeadingCommentRanges().map(t => t.getText()).join("\n") || "";

        result += `${indentStr}    ${jsDoc}\n`;
        result += `${indentStr}    ${propName}: `;

        if (propType.getCallSignatures().length > 0) {
            const signature = propType.getCallSignatures()[0];
            const parameters = signature.getParameters().map(p => {
                const name = p.getName();
                const isOptional = p.isOptional() || p.getValueDeclaration()?.getText().includes("?");
                const type = p.getTypeAtLocation(exampleClass).getText().replaceAll(/Buffer<[^>]+>/gm, "Buffer").replaceAll(/Uint8Array<[^>]+>/gm, "Uint8Array");
                return `${name}${isOptional ? "?" : ""}: ${type}`;
            }).join(", ");

            const callingParams = signature.getParameters().map(p => p.getName()).join(", ");
            let returnType = signature.getReturnType().getText();
            if (!returnType.includes("Promise")) returnType = `Promise<${returnType}>`;

            const fullPath = path.concat(propName).join(".");
            result += `async (${parameters}): ${returnType} => await ipcRenderer.invoke("smule.${fullPath}"${callingParams ? `, ${callingParams}` : ""}),\n`;
            backendContent += `    ipcMain.handle("smule.${fullPath}", async (_event: IpcMainInvokeEvent${parameters ? `, ${parameters}` : ""}): ${returnType} => await client.${fullPath}(${callingParams}));\n`;
        }
        else if (propType.isObject()) {
            result += generateInterfaceFromType(propType, indent + 1, [...path, propName]) + ",\n";
        }
        else {
            result += `${propType.getText()};\n`;
        }
    }

    result += `${indentStr}}`;
    return result;
}

// Generate interface content
let rendererContent = `import { ipcRenderer } from "electron";\n`
                    + `export const smule = {\n`;
for (const property of exampleClass.getProperties()) {
    progress.increment(1, { stage: "Parsing: " + property.getName() });
    if (Node.isPropertySignature(property) && property.hasModifier(SyntaxKind.PrivateKeyword)) continue;

    const jsDoc = property.getJsDocs()[0]?.getText() || "";
    const propName = property.getName();
    const propType = property.getType();
    if (!propType.getText().includes("=>")) continue

    rendererContent += `  ${jsDoc}\n`;
    rendererContent += `  ${propName}: `;
    rendererContent += generateInterfaceFromType(propType, 1, [propName]);
    rendererContent += ",\n";
}

rendererContent += "}\nexport const smuleDotCom = {\n";
for (const property of secondaryClass.getMethods()) {
    progress.increment(1, { stage: "Parsing: " + property.getName() });
    // if (Node.isPropertySignature(property) && property.hasModifier(SyntaxKind.PrivateKeyword)) continue;

    const jsDoc = property.getJsDocs()[0]?.getText() || "";
    const propName = property.getName();
    const propType = property.getType();
    // if (!propType.getText().includes("=>")) continue

    rendererContent += `    ${jsDoc}\n`;
    rendererContent += `    ${propName}: `;
    rendererContent += generateInterfaceFromType(propType, 1, [propName], true);
    rendererContent += ",\n";
}

rendererContent += "}";
backendContent += "}";

let pathReplace = __dirname.replaceAll("\\", "/").replace("/scripts", "/src/api/")
rendererContent = rendererContent.replaceAll(
    pathReplace,
    "../api/"
)
backendContent = backendContent.replaceAll(
    pathReplace,
    "../api/"
)
let mainDirReplace = __dirname.replaceAll("\\", "/").replace("/scripts", "/")
rendererContent = rendererContent.replaceAll(
    mainDirReplace,
    "../../"
)
backendContent = backendContent.replaceAll(
    mainDirReplace,
    "../../"
)


const generated_warning = 
`//    _____ ______ _   _ ______ _____         _______ ______ _____  
//   / ____|  ____| \\ | |  ____|  __ \\     /\\|__   __|  ____|  __ \\ 
//  | |  __| |__  |  \\| | |__  | |__) |   /  \\  | |  | |__  | |  | |
//  | | |_ |  __| | .   |  __| |  _  /   / /\\ \\ | |  |  __| | |  | |
//  | |__| | |____| |\\  | |____| | \\ \\  / ____ \\| |  | |____| |__| |
//   \\_____|______|_| \\_|______|_|  \\_\\/_/    \\_\\_|  |______|_____/ 

// This file was automatically generated by scripts/generateIPCFiles.ts
// Do not edit this file manually, as your changes will be overwritten.`

rendererContent = `${generated_warning}\n\n${rendererContent}`
backendContent = `${generated_warning}\n\n${backendContent}`

progress.increment(1, {stage: "Writing IPC file (smule-ipc.ts)"})
// Write to file
project.createSourceFile("./src/electron/smule-ipc.ts", rendererContent, {
    overwrite: true,
}).saveSync();
progress.increment(1, {stage: "Writing IPC handler file (smule-handler.ts)"})
project.createSourceFile("./src/electron/smule-handler.ts", backendContent, {
    overwrite: true
}).saveSync()
progress.increment(1, {stage: "Done!"})
progress.stop()