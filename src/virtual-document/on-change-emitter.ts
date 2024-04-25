/**
 * @author WMXPY
 * @namespace VirtualDocument
 * @description On Change Emitter
 */
import * as vscode from "vscode";

export const onChangeEmitter = new vscode.EventEmitter<vscode.Uri>();
