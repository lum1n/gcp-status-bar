import * as vscode from 'vscode';
const cp = require('child_process');

let currentGCPProject: vscode.StatusBarItem;

export function activate({ subscriptions }: vscode.ExtensionContext) {
    subscriptions.push(currentGCPProject);
    const myCommandId = 'sample.showCurrentGCPProject';
    currentGCPProject = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Left,
        1
    );
    currentGCPProject.command = myCommandId;
    currentGCPProject.tooltip = 'Current GCP Project (click to update)';
    getProject();
    subscriptions.push(
        vscode.commands.registerCommand(myCommandId, () => {
            getProject();
        })
    );

    subscriptions.push(vscode.window.onDidChangeActiveTextEditor(getProject));
}

function getProject() {
    cp.exec(
        "gcloud info --format='value(config.project)'",
        (err: any, stdout: any, stderr: any) => {
            if (stdout) {
                currentGCPProject.text = `$(megaphone) GCP: ${stdout}`;
                currentGCPProject.show();
            }
        }
    );
}

export function deactivate() {}
