import * as vscode from 'vscode'
import { Compiler } from 'csvg'

export function activate(context: vscode.ExtensionContext) {
  const compile = vscode.commands.registerCommand('csvg.compile', () => {
    const editor = vscode.window.activeTextEditor
    if (!editor) return
    editor.selections.forEach(selection => {
      const selectionText = editor.document.getText(selection)
      const res = new Compiler().compile(selectionText)
      editor.edit(editor => {
        editor.replace(selection, res)
      })
    })
  })

  const optimizeSVG = vscode.commands.registerCommand(
    'csvg.optimizeSVG',
    () => {
      const editor = vscode.window.activeTextEditor
      if (!editor) return
      editor.selections.forEach(selection => {
        const selectionText = editor.document.getText(selection)
        Compiler.optimizeSVG(selectionText).then(res => {
          editor.edit(editor => {
            editor.replace(selection, res.data)
          })
        })
      })
    }
  )
  context.subscriptions.push(compile, optimizeSVG)
}
