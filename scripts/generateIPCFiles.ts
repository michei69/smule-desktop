import { Presets, SingleBar } from "cli-progress";
import { Project, Node, InterfaceDeclaration, Type, TypeFormatFlags, SyntaxKind, ArrowFunction, DefaultClause, JSDocableNode, PropertyAssignment } from "ts-morph";

const progress = new SingleBar({
    format: "{percentage}% | {bar} | {stage} | {value}/{total}"
}, Presets.shades_classic)
progress.start(100, 0, {stage: "Loading project files"})

const project = new Project();
const sourceFile = project.addSourceFileAtPath("./src/api/smule.ts");
const exampleClass = sourceFile.getClassOrThrow("Smule")!;
progress.setTotal(exampleClass.getProperties().length + 3)

let backendContent = `import { ipcMain, IpcMainInvokeEvent } from "electron";\n`
                   + `import { Smule } from "../api/smule";\n`
                   + `export function initializeIPCHandler(client: Smule) {\n`
function generateInterfaceFromPublicMembers(node: Node, indent = 0): string {
    const indentStr = " ".repeat(indent * 4);
    let result = "";

    if (Node.isPropertyAssignment(node)) {
        node = node.getInitializerOrThrow();
    }

    // Handle object literals and class instances
    if (Node.isObjectLiteralExpression(node) || node.getType().isObject()) {
        const type = node.getType();
        const properties = type.getProperties();

        result += "{\n";

        for (const property of properties) {
            const declarations = property.getDeclarations();
            var jsDoc = declarations[0].getLeadingCommentRanges().map(t => t.getText()).join("\n");

            result += `${indentStr}    ${jsDoc}\n`;
            result += `${indentStr}    ${property.getName()}: `;

            const initializer = Node.isPropertyAssignment(declarations[0])
                ? declarations[0].getInitializer()
                : declarations[0];
            if (initializer && Node.isFunctionLikeDeclaration(initializer)) {
                // Handle function types
                const parameters = initializer.getParameters().map(p =>
                    `${p.getName()}${p.isOptional() ? "?" : ""}: ${p.getType().getText()}`
                ).join(", ").replaceAll(/Buffer<[^>]+>/gm, "Buffer");
                const callingParameters = initializer.getParameters().map(p => p.getName()).join(", ");
                let parent = initializer.getParent()
                let dotnot = []
                while (parent) {
                    if (parent.getKind() == SyntaxKind.PropertyDeclaration || parent.getKind() == SyntaxKind.PropertyAssignment)
                        dotnot = [parent.getSymbol().getName(), ...dotnot]
                    parent = parent.getParent()
                }

                var returnType = initializer.getReturnType().getText();
                if (!returnType.includes("Promise")) returnType = `Promise<${returnType}>`;
                result += `async (${parameters}): ${returnType} => await ipcRenderer.invoke("smule.${dotnot.join(".")}"${callingParameters ? `, ${callingParameters}` : ""}),\n`;
                backendContent += `    ipcMain.handle("smule.${dotnot.join(".")}", async (_event: IpcMainInvokeEvent${parameters ? `, ${parameters}` : ""}): ${returnType} => await client.${dotnot.join(".")}(${callingParameters}))\n`;
            } else if (initializer && Node.isObjectLiteralExpression(initializer)) {
                // Recursively process nested objects
                result += generateInterfaceFromPublicMembers(initializer, indent + 1) + ",";
            } else {
                // Handle primitive values
                result += `${initializer?.getType().getText() ?? 'any'};\n`;
            }
        }

        result += `${indentStr}}`;
        return result;
    }

    // Handle primitive types
    return node.getType().getText() + ",\n";
}

// Generate interface content
let rendererContent = `import { ipcRenderer } from "electron";\n`
                    + `export const smule = {\n`;
for (const property of exampleClass.getProperties()) {
    progress.increment(1, {stage: "Parsing: " + property.getName()})
    if (property.getModifiers().some(modif => modif.getText() == "private" || modif.getText() == "protected")) continue; // Skip non-public properties

    const jsDoc = property.getJsDocs()[0]?.getText() || "";
    const propName = property.getName();
    const initializer = property.getInitializer();
    if (!initializer || !Node.isObjectLiteralExpression(initializer)) continue;

    rendererContent += `  ${jsDoc}\n`;
    rendererContent += `  ${propName}: `;

    if (initializer && Node.isObjectLiteralExpression(initializer)) {
        rendererContent += generateInterfaceFromPublicMembers(initializer, 1);
    }

    rendererContent += ",\n";
}

backendContent += "}";
rendererContent += "}";

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