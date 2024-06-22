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

export const saveMemoriesToNote = async (
	plugin: MyPlugin,
	memories: string,
): Promise<void> => {
	const notePath = 'AI-memories.md'
	const memoryFile = plugin.app.vault.getAbstractFileByPath(notePath)

	const view = plugin.app.workspace.getActiveViewOfType(MarkdownView)
	if (!view) return
	const currentNoteFile = view.file
	const currentNoteDate = currentNoteFile?.basename
	const memoriesWithDate = memories
		.split('\n')
		.map((memory) => `${memory} - ${currentNoteDate}`)
		.join('\n')

	if (memoryFile instanceof TFile) {
		const content = await plugin.app.vault.read(memoryFile)
		const updatedContent = `${memoriesWithDate}\n\n${content}`
		await plugin.app.vault.modify(memoryFile, updatedContent)
	} else {
		await plugin.app.vault.create(notePath, memoriesWithDate)
	}

	await openAIMemoriesNote(plugin)
}

export const getMemoriesContent = async (plugin: MyPlugin): Promise<string> => {
	const aiMemoriesPath = 'AI-memories.md'
	const aiMemoriesFile = plugin.app.vault.getAbstractFileByPath(aiMemoriesPath)
	if (aiMemoriesFile instanceof TFile) {
		console.log('🚀 ~ getMemoriesContent ~ aiMemoriesFile:', aiMemoriesFile)
		return await plugin.app.vault.read(aiMemoriesFile)
	}
	return ''
}
