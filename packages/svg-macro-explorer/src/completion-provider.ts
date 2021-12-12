// Copied from https://github.com/nbelyh/editsvgcode

import * as m from 'monaco-editor'
import { SvgSchema } from './svg-schema'

type SvgSchemaKey = keyof typeof SvgSchema

function getAreaInfo(text: string) {
    // opening for strings, comments and CDATA
    const items = ['"', '\'', '<!--', '<![CDATA[']
    let isCompletionAvailable = true
    // remove all comments, strings and CDATA
    text = text.replace(/"([^"\\]*(\\.[^"\\]*)*)"|'([^'\\]*(\\.[^'\\]*)*)'|<!--([\s\S])*?-->|<!\[CDATA\[(.*?)\]\]>/g, '')
    for (let i = 0; i < items.length; i++) {
        const itemIdx = text.indexOf(items[i])
        if (itemIdx > -1) {
            // we are inside one of unavailable areas, so we remove that area
            // from our clear text
            text = text.substring(0, itemIdx)
            // and the completion is not available
            isCompletionAvailable = false
        }
    }

    // if text is at the end of th tag, drop it
    text = text.replace(/<\/*[a-zA-Z-]+$/, '')

    return {
        isCompletionAvailable: isCompletionAvailable,
        clearedText: text
    }
}

function getLastOpenedTag(text: string): undefined | { tagName: SvgSchemaKey, isAttributeSearch: boolean } {
    // get all tags inside of the content
    const tags = text.match(/<\/*(?=\S*)([a-zA-Z-]+)/g)
    if (!tags) {
        return undefined
    }
    // we need to know which tags are closed
    const closingTags = []
    for (let i = tags.length - 1; i >= 0; i--) {
        if (tags[i].indexOf('</') === 0) {
            closingTags.push(tags[i].substring('</'.length))
        }
        else {
            // get the last position of the tag
            const tagPosition = text.lastIndexOf(tags[i])
            const tag = tags[i].substring('<'.length) as SvgSchemaKey
            const closingBracketIdx = text.indexOf('/>', tagPosition)
            // if the tag wasn't closed
            if (closingBracketIdx === -1) {
                // if there are no closing tags or the current tag wasn't closed
                if (!closingTags.length || closingTags[closingTags.length - 1] !== tag) {
                    // we found our tag, but let's get the information if we are looking for
                    // a child element or an attribute
                    text = text.substring(tagPosition)
                    return {
                        tagName: tag,
                        isAttributeSearch: text.indexOf('<') > text.indexOf('>')
                    }
                }
                // remove the last closed tag
                closingTags.splice(closingTags.length - 1, 1)
            }
            // remove the last checked tag and continue processing the rest of the content
            text = text.substring(0, tagPosition)
        }
    }
}

function isItemAvailable(itemName: string, maxOccurs: string, items: string[]) {
    // the default for 'maxOccurs' is 1
    maxOccurs = maxOccurs || '1'
    // the element can appear infinite times, so it is available
    if (maxOccurs && maxOccurs === 'unbounded') {
        return true
    }
    // count how many times the element appeared
    let count = 0
    for (let i = 0; i < items.length; i++) {
        if (items[i] === itemName) {
            count++
        }
    }
    // if it didn't appear yet, or it can appear again, then it
    // is available, otherwise it't not
    return count === 0 || parseInt(maxOccurs) > count
}

// function findAttributes(elements) {
//     const attrs = []
//     for (let i = 0; i < elements.length; i++) {
//         // skip level if it is a 'complexType' tag
//         if (elements[i].tagName === 'complexType') {
//             const child = findAttributes(elements[i].children)
//             if (child) {
//                 return child
//             }
//         }
//         // we need only those XSD elements that have a
//         // tag 'attribute'
//         else if (elements[i].tagName === 'attribute') {
//             attrs.push(elements[i])
//         }
//     }
//     return attrs
// }

function getAvailableAttribute(monaco: typeof m, lastOpenedTag: { tagName: SvgSchemaKey, isAttributeSearch: boolean }, usedChildTags: string[]) {
    const availableItems = []

    const info = SvgSchema[lastOpenedTag.tagName]

    // if there are no attributes, then there are no
    // suggestions available
    if (!info || !info.attributes) {
        return []
    }
    for (let i = 0; i < info.attributes.length; i++) {
        // get all attributes for the element
        const attribute = info.attributes[i]
        // accept it in a suggestion list only if it is available
        if (isItemAvailable(attribute.name, (attribute as any).maxOccurs, usedChildTags)) {
            // mark it as a 'property', and get the documentation
            availableItems.push({
                label: attribute.name,
                insertText: `${attribute.name}="$\{1}"`,
                kind: monaco.languages.CompletionItemKind.Property,
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                detail: attribute.detail,
                documentation: {
                    value: attribute.description || "",
                    isTrusted: true
                }
            })
        }
    }
    // return the elements we found
    return availableItems
}

function getAvailableElements(monaco: typeof m, lastOpenedTag: { tagName: SvgSchemaKey, isAttributeSearch: boolean }, usedItems: string[]) {
    const availableItems = []

    const info = SvgSchema[lastOpenedTag.tagName]

    // if there are no such elements, then there are no suggestions
    if (!info || !info.elements) {
        return []
    }

    for (let i = 0; i < info.elements.length; i++) {
        const element = info.elements[i]
        const elementInfo = SvgSchema[element as SvgSchemaKey]
        availableItems.push({
            label: element,
            insertText: `${element}>$\{1}</${element}>`,
            kind: monaco.languages.CompletionItemKind.Class,
            detail: elementInfo.detail,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: {
                value: elementInfo.description || "",
                isTrusted: true
            }
        })
    }

    // return the suggestions we found
    return availableItems
}

function isAtTheEndOfTag(text: string) {
    return 0
}

export function getXmlCompletionProvider(monaco: typeof m): m.languages.CompletionItemProvider {

    return {
        triggerCharacters: ['<'],
        provideCompletionItems(model, position): m.languages.ProviderResult<m.languages.CompletionList> {
            // get editor content before the pointer
            const textUntilPosition = model.getValueInRange({ startLineNumber: 1, startColumn: 1, endLineNumber: position.lineNumber, endColumn: position.column })
            // get content info - are we inside of the area where we don't want suggestions,
            // what is the content without those areas
            const areaInfo = getAreaInfo(textUntilPosition) // isCompletionAvailable, clearedText
            // if we don't want any suggestions, return empty array
            if (!areaInfo.isCompletionAvailable) {
                return [] as any
            }
            // if we want suggestions, inside of which tag are we?
            const lastOpenedTag = getLastOpenedTag(areaInfo.clearedText)
            // parse the content (not cleared text) into an xml document
            const parser = new DOMParser()
            const xmlDoc = parser.parseFromString(textUntilPosition, 'text/xml')
            // get opened tags to see what tag we should look for in the XSD schema
            const openedTags = []
            // get the elements/attributes that are already mentioned in the element we're in
            const usedItems = []
            const isAttributeSearch = lastOpenedTag && lastOpenedTag.isAttributeSearch

            // no need to calculate the position in the XSD schema if we are in the root element
            if (lastOpenedTag) {
                // parse the content (not cleared text) into an xml document
                let lastChild = xmlDoc.lastElementChild
                while (lastChild) {
                    openedTags.push(lastChild.tagName)
                    // if we found our last opened tag
                    if (lastChild.tagName === lastOpenedTag.tagName) {
                        // if we are looking for attributes, then used items should
                        // be the attributes we already used
                        if (lastOpenedTag.isAttributeSearch) {
                            const attrs = lastChild.attributes
                            for (let i = 0; i < attrs.length; i++) {
                                usedItems.push(attrs[i].nodeName)
                            }
                        }
                        else {
                            // if we are looking for child elements, then used items
                            // should be the elements that were already used
                            const children = lastChild.children
                            for (let i = 0; i < children.length; i++) {
                                usedItems.push(children[i].tagName)
                            }
                        }
                        break
                    }
                    // we haven't found the last opened tag yet, so we move to
                    // the next element
                    lastChild = lastChild.lastElementChild
                }
            }

            const suggestions = lastOpenedTag
                ? isAttributeSearch
                    ? getAvailableAttribute(monaco, lastOpenedTag, usedItems)
                    : getAvailableElements(monaco, lastOpenedTag, usedItems)
                : []

            console.log(suggestions)

            return {
                suggestions
            } as any
        }
    }
}

export function getXmlHoverProvider(monaco: typeof m): m.languages.HoverProvider {
    return {
        provideHover (model, position, token):m.languages.ProviderResult<m.languages.Hover> {
            const wordInfo = model.getWordAtPosition(position)
            if (!wordInfo) return

            const line = model.getLineContent(position.lineNumber)
            if (line.substr(wordInfo.startColumn - 2, 1) == '<') {
                const info = SvgSchema[(wordInfo.word as SvgSchemaKey)]
                if (info) {
                    return {
                        contents: [
                            { value: `**${wordInfo.word}**` },
                            { value: info.description! }
                        ],
                        range: new monaco.Range(position.lineNumber, wordInfo.startColumn, position.lineNumber, wordInfo.endColumn),
                    }
                }
            } else {
                const textUntilPosition = model.getValueInRange({ startLineNumber: 1, startColumn: 1, endLineNumber: position.lineNumber, endColumn: position.column })
                const areaInfo = getAreaInfo(textUntilPosition) // isCompletionAvailable, clearedText
                if (areaInfo.isCompletionAvailable) {
                    const lastOpenedTag = getLastOpenedTag(areaInfo.clearedText)
                    const info = SvgSchema[lastOpenedTag!.tagName]
                    if (info && info.attributes) {
                        for (let i = 0; i < info.attributes.length; i++) {
                            // get all attributes for the element
                            const attribute = info.attributes[i]
                            if (attribute.name === wordInfo.word) {
                                return {
                                    contents: [
                                        { value: `**${wordInfo.word}**` },
                                        { value: attribute.description! }
                                    ],
                                    range: new monaco.Range(position.lineNumber, wordInfo.startColumn, position.lineNumber, wordInfo.endColumn),
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}