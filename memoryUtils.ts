import { TFile, MarkdownView } from 'obsidian'

import MyPlugin from './main'
import { fetchMemories as fetchMemoriesAPI } from './apiHandler'

export const getAIMemoriesContent = async (
	plugin: MyPlugin,
): Promise<string> => {
	const aiMemoriesPath = 'AI-memories.md'
	const aiMemoriesFile = plugin.app.vault.getAbstractFileByPath(aiMemoriesPath)
	if (aiMemoriesFile instanceof TFile) {
		return await plugin.app.vault.read(aiMemoriesFile)
	}
	return ''
}

export const fetchMemories = async (
	plugin: MyPlugin,
	userInput: string,
): Promise<string> => {
	return await fetchMemoriesAPI(plugin, userInput, () =>
		getAIMemoriesContent(plugin),
	)
}

export const openAIMemoriesNote = async (plugin: MyPlugin): Promise<void> => {
	const notePath = 'AI-memories.md'
	const memoryFile = plugin.app.vault.getAbstractFileByPath(notePath)

	if (memoryFile instanceof TFile) {
		const leaf = plugin.app.workspace.getLeaf(true)
		await leaf.openFile(memoryFile)
	}
}

export const saveMemoriesToNote = async (plugin: MyPlugin): Promise<void> => {
	const notePath = 'AI-memories.md'
	const memoryFile = plugin.app.vault.getAbstractFileByPath(notePath)
	const view = plugin.app.workspace.getActiveViewOfType(MarkdownView)
	if (!view) return
	const currentNoteFile = view.file

	if (memoryFile instanceof TFile && currentNoteFile instanceof TFile) {
		const memoriesContent = await plugin.app.vault.read(memoryFile)
		const currentNoteContent = await plugin.app.vault.read(currentNoteFile)
		const today = new Date().toISOString().split('T')[0]

		const updatedMemories = await fetchMemoriesAPI(
			plugin,
			currentNoteContent,
			today,
			() => Promise.resolve(memoriesContent),
		)

		const updatedContent = `${updatedMemories}\n\n${memoriesContent}`

		console.log('🚀 ~ saveMemoriesToNote ~ updatedContent:', updatedContent)
		await plugin.app.vault.modify(memoryFile, updatedContent)
		await openAIMemoriesNote(plugin)
	} else {
		console.log('Error: Unable to access memory file or current note file')
	}
}

export const getMemoriesContent = async (plugin: MyPlugin): Promise<string> => {
	const aiMemoriesPath = 'AI-memories.md'
	const aiMemoriesFile = plugin.app.vault.getAbstractFileByPath(aiMemoriesPath)
	if (aiMemoriesFile instanceof TFile) {
		return await plugin.app.vault.read(aiMemoriesFile)
	}
	return ''
}
